<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Redis;

/**
 * Service class for handling One-Time Password (OTP) operations.
 */
class OTPService
{
    /**
     * Helper method to generate a consistent redis key.
     * Sub-keys available:
     *  - verify-email
     */
    private function getRedisKey(string $subkey, string $email): string
    {
        return 'otp:'.$subkey.':'.$email;
    }

    /**
     * Generate a new 6-digit OTP and its expiration time.
     * Store in Redis for 10 mins.
     * Sub-keys available:
     *  - verify-email
     */
    public function generateOTP(string $email, string $subkey): array
    {
        $otp = rand(100000, 999999);
        $expiresAt = Carbon::now()->addMinutes(10);

        // add to redis
        Redis::set($this->getRedisKey($subkey, $email), $otp);
        // set expiration
        Redis::expireAt(
            $this->getRedisKey($subkey, $email),
            $expiresAt->getTimestamp()
        );

        return [
            'otp' => $otp,
            'expires_at' => $expiresAt,
        ];
    }

    /**
     * Verify if OTP exists in redis and matches.
     */
    public function verifyOTP(string $email, string $otp, string $subkey): ?User
    {
        $key = $this->getRedisKey($subkey, $email);
        $storedOtp = Redis::get($key); // does this otp exists?

        // check if otp exists and matches
        if ($storedOtp && $storedOtp == $otp) {
            $user = User::where('email', $email)->first();

            if ($user) {
                // Optional: Delete the OTP after successful registration.
                Redis::del($key);

                return $user;
            }
        }

        return null;
    }
}
