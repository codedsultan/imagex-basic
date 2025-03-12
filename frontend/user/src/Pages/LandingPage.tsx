import React from 'react';
import { Head } from '@inertiajs/react';

const LandingPage: React.FC = () => {
  return (
    <>
      <Head title="Welcome to ImageX" />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold">ImageX</h1>
            <nav>
              <a href="/user/login" className="mr-4 hover:underline">
                Login
              </a>
              <a href="/user/register" className="hover:underline">
                Register
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto flex-grow py-12">
          <section className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Discover Your Next Favorite Design
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Explore our collection of unique designs and create your own custom t-shirt with ease.
            </p>
            <div>
              <a
                href="/user/register"
                className="bg-blue-500 text-white py-3 px-6 rounded mr-4 hover:bg-blue-600"
              >
                Get Started
              </a>
              <a
                href="/user/login"
                className="bg-transparent border border-blue-500 text-blue-500 py-3 px-6 rounded hover:bg-blue-500 hover:text-white"
              >
                Login
              </a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 text-gray-700 p-6">
          <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} ImageX. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
