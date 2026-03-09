<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Jobs\SendMailJob;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Service class to handle all authentication and user-related operations.
 */
class AuthService
{
    /** @var OTPService */
    protected $otpService;

    /**
     * Create a new AuthService instance.
     */
    public function __construct(OTPService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Authenticate a user by email and password.
     *
     * @return array|null Returns array containing access token and user resource, or null on failure.
     */
    public function login(string $email, string $password): ?array
    {
        Log::info('Login attempt for email: {email}', ['email' => $email]);

        $user = User::where('email', $email)->first();

        // Verify user existence and password validity
        if (! $user || ! Hash::check($password, $user->password)) {
            return null;
        }

        // Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
        ];
    }

    /**
     * Register a new subscriber user.
     *
     * @param  array  $data  Validated user data (first_name, last_name, email, password).
     * @return array Details of the registered user and initial auth token.
     */
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            Log::info('[AuthService]: Registration attempt for: '.$data['email']);

            // Create user record in database
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'name' => $data['first_name'].' '.$data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'roles' => ['subscriber'], // Store role in JSON column
            ]);

            // Attach 'subscriber' role using relationship
            $subscriberRole = Role::where('slug', 'subscriber')->orWhere('name', 'subscriber')->first();
            if ($subscriberRole) {
                $user->roles()->sync($subscriberRole->id);
            }

            // Generate email verification OTP
            $otpData = $this->otpService->generateOTP($user->email, 'verify-email');

            // Queue verification email
            SendMailJob::dispatch(
                $user->name,
                $user->email,
                $otpData['otp']
            );

            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'token' => $token,
                'user' => new UserResource($user->load('roles')),
                'otp_expires_in' => 10, // Minutes
            ];
        });
    }

    /**
     * Terminate the user's current session by deleting the token.
     */
    public function logout(User $user): ?bool
    {
        return $user->currentAccessToken()?->delete();
    }

    /**
     * Update user profile information, including avatar if provided.
     *
     * @param  array  $data  Validated profile data (first_name, last_name, optional avatar).
     * @return UserResource Updated user resource.
     */
    public function updateProfile(User $user, array $data): UserResource
    {
        $user->first_name = $data['first_name'];
        $user->last_name = $data['last_name'];
        $user->name = $data['first_name'].' '.$data['last_name'];

        // Process base64 avatar if present
        if (isset($data['avatar']) && str_starts_with($data['avatar'], 'data:image')) {
            try {
                $imageData = $data['avatar'];

                // Extract MIME type and encoded data
                if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                    $format = strtolower($type[1]); // png, jpeg, etc.

                    if (! in_array($format, ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                        throw new \Exception('Invalid image format.');
                    }

                    $imageData = base64_decode($imageData);
                    if ($imageData === false) {
                        throw new \Exception('Base64 decode failed.');
                    }

                    $imageName = Str::uuid().'.'.$format;
                    $path = 'homes-ph-news/avatars/'.$imageName;

                    Storage::disk('s3')->put($path, $imageData, 'public');

                    // If user already has an old avatar on S3, we might want to delete it here
                    // but usually keeping history or using UUIDs is fine.

                    $user->avatar = Storage::disk('s3')->url($path);
                }
            } catch (\Exception $e) {
                \Log::error('[AuthService]: Avatar upload failed: '.$e->getMessage());
            }
        }

        $user->save();

        return new UserResource($user->load('roles'));
    }

    /**
     * Change user's account password.
     *
     * @return bool True if password was changed, false if current password check failed.
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        // Check if the current password is correct
        if (! Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->password = Hash::make($newPassword);

        return $user->save();
    }
}
