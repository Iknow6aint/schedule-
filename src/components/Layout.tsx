import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavBar from './NavBar'; // Import the NavBar component
import { LogOut } from 'lucide-react';

function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the NavBar component */}
      <NavBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Render the page content */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
