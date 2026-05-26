import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  ChevronDown
} from 'lucide-react';

export function Sidebar({ isOpen, isAdmin }) {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = React.useState(null);

  if (!isAdmin && location.pathname !== '/student-dashboard') {
    return null;
  }

  const adminMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    {
      label: 'Courses',
      icon: BookOpen,
      submenu: [
        { label: 'Manage Courses', href: '/dashboard/courses' },
        { label: 'Course Materials', href: '/dashboard/courses/1/materials' }
      ]
    },
    { label: 'Students', icon: Users, href: '/dashboard/students' },
    { label: 'Enrollments', icon: Users, href: '/dashboard/students/enrollments' },
    { label: 'Blog', icon: FileText, href: '/dashboard/blog' },
    { label: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
  ];

  const studentMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/student-dashboard' },
    { label: 'Courses', icon: BookOpen, href: '/courses' },
    { label: 'Messages', icon: MessageSquare, href: '/messages' },
    { label: 'Blog', icon: FileText, href: '/blog' },
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-center">
          {isOpen && <span className="font-bold text-lg">Menu</span>}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setExpandedMenu(expandedMenu === index ? null : index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isOpen ? '' : 'justify-center'
                    } hover:bg-gray-800`}
                  >
                    <item.icon size={20} />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transform transition ${
                            expandedMenu === index ? 'rotate-180' : ''
                          }`}
                        />
                      </>
                    )}
                  </button>
                  {isOpen && expandedMenu === index && (
                    <div className="ml-4 space-y-2">
                      {item.submenu.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          to={sub.href}
                          className={`block px-4 py-2 rounded-lg transition text-sm ${
                            isActive(sub.href)
                              ? 'bg-blue-600'
                              : 'hover:bg-gray-800'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.href)
                      ? 'bg-blue-600'
                      : 'hover:bg-gray-800'
                  } ${isOpen ? '' : 'justify-center'}`}
                >
                  <item.icon size={20} />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
