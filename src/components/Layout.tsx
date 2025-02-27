import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LogOut, Package, Coffee } from 'lucide-react';

export default function Layout() {
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/inventory"
                className="flex items-center px-4 hover:text-blue-500"
              >
                <Package className="h-5 w-5 mr-2" />
                Inventory
              </Link>
              <Link
                to="/recipe"
                className="flex items-center px-4 hover:text-blue-500"
              >
                <Coffee className="h-5 w-5 mr-2" />
                Recipe
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 hover:text-red-500"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}