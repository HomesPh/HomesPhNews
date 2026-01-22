import { useState } from 'react';
import svgPaths from "../imports/svg-8jkdqq9m6p";

interface SignInProps {
  onSignIn: () => void;
}

export function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check admin credentials
    if (email === 'admin@globalnews.com' && password === 'admin123') {
      setError('');
      onSignIn();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-[40px] h-[40px] bg-[#C10007] rounded-[8px] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g>
                  <g clipPath="url(#clip0_1_360)">
                    <path d={svgPaths.p1c7a5700} fill="white" />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_1_360">
                    <path d="M0 0H20V20H0V0Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-[#111827] leading-[1.2] tracking-[-0.5px]">Global News</h1>
              <p className="text-[14px] font-normal text-[#6b7280] leading-[1.2] tracking-[-0.5px]">Network</p>
            </div>
          </div>

          {/* Sign In Header */}
          <div className="mb-6 text-center">
            <h2 className="text-[24px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">Sign In</h2>
            <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">Welcome back! Please sign in to continue.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
              <p className="text-[14px] text-red-600 tracking-[-0.5px]">{error}</p>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[8px]">
            <p className="text-[12px] text-blue-800 tracking-[-0.5px] mb-1"><strong>Demo Credentials:</strong></p>
            <p className="text-[12px] text-blue-700 tracking-[-0.5px]">Email: admin@globalnews.com</p>
            <p className="text-[12px] text-blue-700 tracking-[-0.5px]">Password: admin123</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-[14px] font-medium text-[#111827] mb-2 tracking-[-0.5px]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent transition-all tracking-[-0.5px]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-[14px] font-medium text-[#111827] mb-2 tracking-[-0.5px]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent transition-all tracking-[-0.5px]"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C10007] hover:bg-[#a10006] text-white font-semibold py-3 px-4 rounded-[8px] transition-colors duration-200 text-[14px] tracking-[-0.5px]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}