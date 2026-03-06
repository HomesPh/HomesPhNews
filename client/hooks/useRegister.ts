'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { register, verifyOTP, type RegisterRequest, type VerifyOTPRequest } from '@/lib/api-v2';
import { useAuth } from '@/lib/api-v2';

// ============================================================
// Types
// ============================================================

interface UseRegisterReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  handleRegister: (data: RegisterRequest) => Promise<void>;
  handleVerifyOTP: (data: VerifyOTPRequest) => Promise<void>;
  resetError: () => void;
}

// ============================================================
// Hook Implementation
// ============================================================

/**
 * Hook for managing user registration flow.
 * Handles API call, state management, and redirection to OTP.
 */
export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);

  // ----------------------
  // State
  // ----------------------
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----------------------
  // Actions
  // ----------------------
  const handleRegister = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await register(data);

      if (response.data.success) {
        // We set the auth state if a token is returned
        if (response.data.token && response.data.user) {
          setAuth(response.data.token, response.data.user);
        }

        // Success message is handled by the component or we could return it
        // For now, follow the requirement to stay on the page for OTP step
        // The component handles the mode switch to 'signup-step2'
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err; // Re-throw to handle in component if needed
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  const handleVerifyOTP = useCallback(async (data: VerifyOTPRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyOTP(data);
      if (response.status !== 200 && response.status !== 201) {
        setError(response.data.message || 'Verification failed');
        throw new Error(response.data.message || 'Verification failed');
      }

      // [ADD] Update user in store if returned
      if (response.data?.user) {
        useAuth.getState().setAuth(useAuth.getState().token || "", response.data.user);
      }
    } catch (err: any) {
      console.error('OTP Verification error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Verification failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // ----------------------
  // Return
  // ----------------------
  return {
    isLoading,
    error,
    handleRegister,
    handleVerifyOTP,
    resetError,
  };
}
