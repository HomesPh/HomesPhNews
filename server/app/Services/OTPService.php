<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;

/**
 * Service class for handling One-Time Password (OTP) operations.
 *
 * This service provides methods for generating, verifying, and clearing OTPs
 * stored on the User model.
 */
class OTPService
{
    /**
     * Generate a new 6-digit OTP and its expiration time.
     *
     * @return array{otp: int, otp_expires_at: \Illuminate\Support\Carbon}
     */
    public function generateOTP(): array
    {
        return [
            'otp' => rand(100000, 999999),
            'otp_expires_at' => Carbon::now()->addMinutes(10)
        ];
    }

    /**
     * Verify the provided OTP for a given email address.
     *
     * Checks if a user exists with the matching email and OTP,
     * and ensures the OTP has not yet expired.
     *
     * @param string $email The user's email address
     * @param string $otp The OTP to verify
     * @return User|null The user if verified, null otherwise
     */
    public function verifyOTP(string $email, string $otp): ?User
    {
        return User::where('email', $email)
            ->where('otp', $otp)
            ->where('otp_expires_at', '>', Carbon::now())
            ->first();
    }

    /**
     * Verify the OTP and simultaneously mark the user's email as verified.
     *
     * If verification is successful, it clears the OTP data from the user
     * and sets the email_verified_at timestamp.
     *
     * @param string $email The user's email address
     * @param string $otp The OTP to verify
     * @return User|null The user if verified and updated, null otherwise
     */
    public function verifyOTPandVerifyEmail(string $email, string $otp): ?User
    {
        $user = $this->verifyOTP($email, $otp);

        if ($user) {
            $user->update([
                'otp' => null,
                'otp_expires_at' => null,
                'email_verified_at' => Carbon::now(),
                'otp_verified_at' => Carbon::now()
            ]);
        }

        return $user;
    }

    /**
     * Clear the OTP and its expiration from the specified user.
     *
     * @param User $user The user instance to clear OTP for
     * @return void
     */
    public function clearOTP(User $user): void
    {
        $user->update([
            'otp' => null,
            'otp_expires_at' => null,
        ]);
    }
}
