import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">User Dashboard</h1>
          <nav>
            <Link href="/dashboard" className="mr-4 hover:underline">
              Dashboard
            </Link>
            <Link href="/user/profile" className="mr-4 hover:underline">
              Profile
            </Link>
            <Link href="/logout" className="hover:underline">
              Logout
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 p-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
