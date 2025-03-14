import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LandingPage: React.FC = () => {
  return (
    <>
      <Head title="Welcome to ImageX" />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold">ImageX</h1>
            <nav>
              <a href={route('login')} className="mr-4 hover:underline">
                Login
              </a>
              <a href={route('register')} className="hover:underline">
                Register
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto flex-grow py-12 px-4">
          <Card className="max-w-4xl mx-auto border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold">
                User Landing Discover Your Next Favorite Design
              </CardTitle>
              <CardDescription className="text-lg">
                Explore our collection of unique designs and create your own custom t-shirt with ease.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center space-x-4">
              <Button asChild size="lg" className="font-medium">
                <a href={route('register')}>Get Started</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium">
                <a href={route('login')}>Login</a>
              </Button>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-muted text-muted-foreground p-6">
          <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} ImageX. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;