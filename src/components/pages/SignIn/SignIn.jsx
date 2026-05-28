import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "@/context";
import { Button } from '@/components';

export function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors on input change
    if (error) setError('');
    if (fieldErrors.length) setFieldErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors([]);
    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);

      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      const response = err.response?.data;

      if (response?.errors) {
        setFieldErrors(response.errors);
      } else {
        setError(response?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-5 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row h-auto min-h-[600px]">
        {/* Left Side - Branding */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center text-white bg-gradient-to-br from-[#FFA500] to-[#ff8c00] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white text-[#FFA500] rounded-full flex items-center justify-center text-2xl font-bold mb-8 shadow-md">W</div>
            <h1 className="text-4xl font-bold mb-4 m-0">Welcome to Wisdom Wave</h1>
            <p className="text-white/90 text-base leading-relaxed mb-10 m-0">
              Join thousands of learners mastering IT skills. Start your journey to a successful tech career today.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</div>
                <span className="text-[15px] font-medium">Comprehensive IT courses</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</div>
                <span className="text-[15px] font-medium">Learn from industry experts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</div>
                <span className="text-[15px] font-medium">Interactive lessons & projects</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</div>
                <span className="text-[15px] font-medium">Certification upon completion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2 m-0">Sign In</h2>
          <p className="text-[#666666] text-sm mb-8 m-0">Enter your credentials to access your account</p>

          {/* Error Messages */}
          {error && (
            <div className="bg-[#fee2e2] border border-[#ef4444] text-[#b91c1c] p-3 rounded-md mb-5 text-sm">
              {error}
            </div>
          )}
          {fieldErrors.length > 0 && (
            <div className="bg-[#fee2e2] border border-[#ef4444] text-[#b91c1c] p-3 rounded-md mb-5 text-sm">
              <ul className="m-0 pl-[18px]">
                {fieldErrors.map((fe, i) => (
                  <li key={i}>{fe.message}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-semibold text-sm text-[#1a1a1a]">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full p-3 border-2 border-[#e0e0e0] rounded-lg text-[15px] transition-colors duration-300 focus:outline-none focus:border-[#FFA500] focus:ring-[3px] focus:ring-[#FFA500]/10"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-semibold text-sm text-[#1a1a1a]">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 border-2 border-[#e0e0e0] rounded-lg text-[15px] transition-colors duration-300 focus:outline-none focus:border-[#FFA500] focus:ring-[3px] focus:ring-[#FFA500]/10"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="remember"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
                className="w-4 h-4 cursor-pointer accent-[#FFA500]"
              />
              <label htmlFor="remember" className="text-sm text-[#666666] cursor-pointer font-medium">Remember me for 30 days</label>
            </div>

            <div className="text-right -mt-2">
              <a href="#forgot" className="text-sm text-[#FFA500] font-semibold no-underline hover:underline">Forgot your password?</a>
            </div>

            <Button type="submit" className="w-full bg-[#FFA500] hover:bg-[#ff9500] text-white border-none py-3.5 rounded-lg font-bold text-[15px] cursor-pointer mt-2 transition-all duration-300 shadow-[0_4px_12px_rgba(255,165,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(255,165,0,0.4)] h-auto" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center mt-8 text-sm text-[#666666] font-medium">
            Don't have an account? <Link to="/signup" className="text-[#FFA500] font-semibold no-underline hover:underline">Create one now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
