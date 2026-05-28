import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "@/context";
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';

export function ClientNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getDashboardPath = () => {
    if (user?.role === 'ADMIN') return '/dashboard';
    if (user?.role === 'LECTURER') return '/lecturer-dashboard';
    return '/student-dashboard';
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.png" alt="Wisdom Wave" className="w-9 h-9 rounded-lg object-contain" />
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900 tracking-tight">Wisdom</span>
              <span className="text-lg font-bold text-[#FFA500] tracking-tight">Wave</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:text-[#FFA500] hover:bg-[#FFA500]/5"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to={getDashboardPath()}
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:text-[#FFA500] hover:bg-[#FFA500]/5"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFA500] to-[#ff8c00] flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FFA500] to-[#ff8c00] rounded-lg hover:shadow-md hover:shadow-[#FFA500]/25 transition-all duration-200 active:scale-[0.97]"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#FFA500] to-[#ff8c00] rounded-lg hover:shadow-md hover:shadow-[#FFA500]/25 transition-all duration-200 active:scale-[0.97]">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-[#FFA500]/5 hover:text-[#FFA500] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-[#FFA500]/5 hover:text-[#FFA500] transition-colors"
              >
                Dashboard
              </Link>
            )}
            <div className="pt-3 mt-3 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#FFA500] to-[#ff8c00] rounded-lg"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/signin" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FFA500] to-[#ff8c00] rounded-lg">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
