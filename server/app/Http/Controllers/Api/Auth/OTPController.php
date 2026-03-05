<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendOTPRequest;
use App\Http\Requests\Auth\VerifyOTPRequest;
use App\Http\Resources\Api\ErrorResource;
use App\Http\Resources\Api\SuccessResource;
use App\Jobs\SendMailJob;
use App\Models\User;
use App\Services\OTPService;

class OTPController extends Controller
{
    protected $otpService;

    public function __construct(OTPService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Send OTP to User Email
     *
     * @group Authentication
     */
    public function sendOTP(SendOTPRequest $request): SuccessResource|ErrorResource
    {
        $validated = $request->validated();

        // get user
        $user = User::where('email', $validated['email'])->first();

        // if user doesn't exist
        if (! $user) {
            return new ErrorResource([
                'message' => 'User not found.',
                'error_code' => 'USER_NOT_FOUND',
                'status_code' => 404,
            ]);
        }

        // generate otp
        $otp = $this->otpService->generateOTP($user->email, 'verify-email');

        try {
            // Send OTP via Email
            SendMailJob::dispatch(
                $user->name,
                $user->email,
                $otp
            );

            // Update user with OTP data
            $user->update([
                'otp' => $otp,
            ]);

            return new SuccessResource([
                'message' => 'OTP sent successfully to your email',
                'data' => [
                    'expires_in' => 10,
                    'email' => $user->email,
                ],
            ]);
        } catch (\Exception $e) {
            return new ErrorResource([
                'message' => 'Failed to send OTP. Please try again.',
                'error_code' => 'EMAIL_SEND_FAILED',
                'status_code' => 500,
            ]);
        }
    }

    /**
     * Verify OTP and Email
     *
     * Endpoint for verifying OTPs.
     *
     * @group Authentication
     */
    public function verifyOTP(VerifyOTPRequest $request): SuccessResource|ErrorResource
    {
        $validated = $request->validated();

        // verify email with otp
        $user = $this->otpService->verifyOTP(
            $validated['email'],
            $validated['otp'],
            'verify-email'
        );

        if (! $user) {
            return new ErrorResource([
                'message' => 'Invalid or expired OTP',
                'status_code' => 400,
            ]);
        }

        return new SuccessResource([
            'message' => 'OTP verified successfully',
            'user' => new \App\Http\Resources\UserResource($user->load('roles')),
        ]);
    }
}
