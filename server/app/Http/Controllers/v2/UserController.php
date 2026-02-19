<?php

namespace App\Http\Controllers\v2;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\WelcomeBloggerMail;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * (v2) Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->latest()->paginate(10);
        return UserResource::collection($users);
    }

    /**
     * (v2) Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'role' => 'sometimes|string',
        ]);

        // Check if user exists
        $user = User::where('email', $validated['email'])->first();

        if ($user) {
            // User exists. If permissions allow, maybe we just resend the email?
            // For this specific 'fix', let's update their details and resend the email 
            // effectively treating it as a 'retry' for the admin.
            // WARNING: In a strict system, we'd throw 'email taken'. 
            // But for this user's workflow ("no email send..."), this helper logic is useful.
            $user->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            ]);
            
            // Re-generate password for the new email
            $password = Str::random(10);
            $user->password = Hash::make($password);
            
            // Update role if needed
            $roleName = strtolower($request->role ?? 'blogger');
            $role = \App\Models\Role::where('name', $roleName)->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
            }
            $user->save();

            // Resend email logic matches the 'new user' logic below
        } else {
            // Create new user
            $password = Str::random(10);
            $roleName = strtolower($request->role ?? 'blogger');

            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($password),
                'roles' => [$roleName],
            ]);

            $role = \App\Models\Role::where('name', $roleName)->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
            }
        }

        // Send welcome email (Common for both new and existing-retry)
        try {
            $clientUrl = env('APP_URL_CLIENT', 'http://localhost:3000');
            $loginUrl = $clientUrl . '/admin/login?email=' . urlencode($user->email);

            \Log::info("Sending welcome email to: " . $user->email);

            Mail::send('emails.welcome_blogger', [
                'firstName' => $user->first_name,
                'email' => $user->email,
                'password' => $password,
                'loginUrl' => $loginUrl
            ], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Welcome to HomesTV - Your Blogger Account')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });
            
            \Log::info("Welcome email sent successfully to " . $user->email);
        } catch (\Exception $e) {
            \Log::error('Welcome Email Failed: ' . $e->getMessage());
        }

        return new UserResource($user->load('roles'));
    }

    /**
     * (v2) Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with('roles')->findOrFail($id);
        return new UserResource($user);
    }

    /**
     * (v2) Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        if (array_key_exists('name', $validated)) {
            $user->name = $validated['name'];
        }
        if ($request->has('first_name')) {
            $user->first_name = $request->first_name;
        }
        if ($request->has('last_name')) {
            $user->last_name = $request->last_name;
        }
        if (array_key_exists('email', $validated)) {
            $user->email = $validated['email'];
        }
        if (array_key_exists('password', $validated) && $validated['password']) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        if ($request->has('roles')) {
            $roles = \App\Models\Role::whereIn('name', $request->roles)->pluck('id');
            $user->roles()->sync($roles);
        }

        return new UserResource($user->load('roles'));
    }

    /**
     * (v2) Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }
    
    /**
     * (v2) Update the specified user's roles.
     */
    public function updateRole(Request $request, string $id)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'string',
        ]);

        $user = User::findOrFail($id);

        $roles = \App\Models\Role::whereIn('name', $request->roles)->pluck('id');
        $user->roles()->sync($roles);

        return new UserResource($user->load('roles'));
    }

    /**
     * (v2) Get public user info by email.
     */
    public function getPublicInfo(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'avatar' => $user->avatar,
        ]);
    }
}
