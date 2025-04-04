// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon, Notebook } from 'lucide-react';
import Image from 'next/image';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login with:', username, password);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Logo */}
      <div className="flex items-center mb-12">
        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
          <Notebook className='text-white' />
        </div>
        <span className="ml-2 text-xl font-bold uppercase">sfs-Kanban</span>
      </div>

      {/* Welcome text */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600">Login and Manage your tasks!</p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Username field */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login button */}
          <Button type="submit" className="w-full h-12 bg-blue-500 hover:bg-blue-600">
            Login
          </Button>

          {/* Sign up link */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}