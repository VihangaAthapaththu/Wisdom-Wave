import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  ChevronDown,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

export function Sidebar({ isOpen, role }) {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = React.useState(null);

  const adminMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    {
      label: 'Courses',
      icon: BookOpen,
      submenu: [
        { label: 'Manage Courses', href: '/dashboard/courses' },
      ],
    },
    { label: 'Students', icon: Users, href: '/dashboard/students' },
    { label: 'Enrollments', icon: ClipboardList, href: '/dashboard/students/enrollments' },
    { label: 'Lecturers', icon: GraduationCap, href: '/dashboard/lecturers' },
    { label: 'Blog', icon: FileText, href: '/dashboard/blog' },
    { label: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
  ];

  const lecturerMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/lecturer-dashboard' },
    { label: 'My Courses', icon: BookOpen, href: '/lecturer-dashboard/courses' },
    { label: 'Blog', icon: FileText, href: '/lecturer-dashboard/blog' },
  ];

  const studentMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/student-dashboard' },
    { label: 'Courses', icon: BookOpen, href: '/courses' },
    { label: 'Messages', icon: MessageSquare, href: '/messages' },
    { label: 'Blog', icon: FileText, href: '/blog' },
  ];

  const menuItems =
    role === 'ADMIN' ? adminMenuItems :
    role === 'LECTURER' ? lecturerMenuItems :
    studentMenuItems;

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 flex flex-col overflow-y-auto`}
    >
      <div className="p-4 border-b border-gray-800 flex items-center justify-center">
        {isOpen && <span className="font-bold text-lg">Menu</span>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <>
                <button
                  onClick={() => setExpandedMenu(expandedMenu === index ? null : index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isOpen ? '' : 'justify-center'
                  } hover:bg-primary/20 hover:text-primary-300`}
                >
                  <item.icon size={20} />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${
                          expandedMenu === index ? 'rotate-180' : ''
                        }`}
                      />
                    </>
                  )}
                </button>
                {isOpen && expandedMenu === index && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.href}
                        className={`block px-4 py-2 rounded-lg transition-colors text-sm ${
                          isActive(sub.href)
                            ? 'bg-primary/20 text-primary-300 font-medium'
                            : 'text-gray-400 hover:bg-primary/10 hover:text-primary-300'
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                  isActive(item.href)
                    ? 'bg-primary/20 text-primary-300 font-medium'
                    : 'text-gray-300 hover:bg-primary/10 hover:text-primary-300'
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
  );
}

