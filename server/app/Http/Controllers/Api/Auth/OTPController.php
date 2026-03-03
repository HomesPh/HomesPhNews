<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\OTPService;
use App\Http\Requests\Auth\SendOTPRequest;
use App\Http\Requests\Auth\VerifyOTPRequest;
use App\Models\User;
use App\Jobs\SendMailJob;
use App\Http\Resources\Api\SuccessResource;
use App\Http\Resources\Api\ErrorResource;

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
     * Generates a 6-digit OTP and sends it to the user's email address.
     * The OTP expires after 10 minutes.
     * 
     * @group Authentication
     */
    public function sendOTP(SendOTPRequest $request): SuccessResource|ErrorResource
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return new ErrorResource([
                'message' => 'User not found.',
                'error_code' => 'USER_NOT_FOUND',
                'status_code' => 404
            ]);
        }

        // Generate OTP using service
        $otpData = $this->otpService->generateOTP();

        try {
            // Send OTP via Email
            SendMailJob::dispatch(
                $user->name,
                $user->email,
                $otpData['otp']
            );


            // Update user with OTP data
            $user->update([
                'otp' => $otpData['otp'],
                'otp_expires_at' => $otpData['otp_expires_at']
            ]);


            return new SuccessResource([
                'message' => 'OTP sent successfully to your email',
                'data' => [
                    'expires_in' => 10,
                    'email' => $user->email
                ]
            ]);
        } catch (\Exception $e) {
            return new ErrorResource([
                'message' => 'Failed to send OTP. Please try again.',
                'error_code' => 'EMAIL_SEND_FAILED',
                'status_code' => 500
            ]);
        }
    }

    /**
     * Verify OTP and Email
     * 
     * Verifies the provided OTP for the user's email. If valid, marks the email
     * as verified and clears the OTP data.
     * 
     * @group Authentication
     */
    public function verifyOTP(VerifyOTPRequest $request): SuccessResource|ErrorResource
    {
        $validated = $request->validated();

         // Use email verification method for OTP verification
        $user = $this->otpService->verifyOTPAndVerifyEmail(
              $validated['email'], 
              $validated['otp']
          );

        if (!$user) {
            return new ErrorResource([
                'message' => 'Invalid or expired OTP',
                'status_code' => 400
            ]);
        }

        return new SuccessResource([
            'message' => 'OTP verified successfully'
        ]);
    }
}
