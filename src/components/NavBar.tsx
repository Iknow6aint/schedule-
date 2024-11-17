import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, ClipboardList, Bell, MessageSquare, Menu, X } from 'lucide-react';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Bell className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                DeliveryReminder
              </span>
            </div>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex sm:ml-6 sm:space-x-8">
            <Link
              to="/"
              className={`${
                isActive('/')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/create-schedule"
              className={`${
                isActive('/create-schedule')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Create Schedule
            </Link>
            <Link
              to="/manage-schedules"
              className={`${
                isActive('/manage-schedules')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Manage Schedules
            </Link>
            <Link
              to="/notifications"
              className={`${
                isActive('/notifications')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Notifications
            </Link>
          </div>
        </div>

        {/* Mobile menu links */}
        <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${
                isActive('/')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Dashboard
            </Link>
            <Link
              to="/create-schedule"
              className={`${
                isActive('/create-schedule')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Create Schedule
            </Link>
            <Link
              to="/manage-schedules"
              className={`${
                isActive('/manage-schedules')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Manage Schedules
            </Link>
            <Link
              to="/notifications"
              className={`${
                isActive('/notifications')
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Notifications
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
