<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Jobs\SendMailJob;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

/**
 * Service class to handle all authentication and user-related operations.
 */
class AuthService
{
    /** @var OTPService */
    protected $otpService;

    /** @var FileService */
    protected $fileService;

    /**
     * Create a new AuthService instance.
     */
    public function __construct(OTPService $otpService, FileService $fileService)
    {
        $this->otpService = $otpService;
        $this->fileService = $fileService;
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
        Log::info('[AuthService]: Registration attempt for: {email}', ['email' => $data['email']]);

        return DB::transaction(function () use ($data) {
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
                $url = $this->fileService->uploadBase64Image($data['avatar'], 'homes-ph-news/avatars');
                if ($url) {
                    $user->avatar = $url;
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
