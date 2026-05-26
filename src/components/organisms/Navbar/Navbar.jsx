import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Settings, LogOut, User } from 'lucide-react';

export function Navbar({ onMenuToggle, isAdmin = false, onRoleChange }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const toggleRole = () => {
    if (onRoleChange) {
      onRoleChange(!isAdmin);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16">
        {/* Left Side - Logo & Menu */}
        <div className="flex items-center gap-4">
          {onMenuToggle && (
            <button 
              onClick={onMenuToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="hidden sm:inline text-lg font-bold text-gray-800">Wisdom</span>
          </Link>
        </div>

        {/* Right Side - Icons & User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Role Toggle (for demo) */}
          {onRoleChange && (
            <button 
              onClick={toggleRole}
              className="hidden sm:flex px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {isAdmin ? 'Admin' : 'Student'}
            </button>
          )}

          {/* User Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">John Doe</p>
                  <p className="text-sm text-gray-600">{isAdmin ? 'Administrator' : 'Student'}</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition">
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition text-red-600"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
