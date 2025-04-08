"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Notebook } from "lucide-react";
import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabase";
import DashboardPreview from "@/components/DashboardPreview";
import Link from "next/link";

export default function RegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const supabase = createSupabaseClient();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else window.location.href = "/";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister();
    console.log("Register with:", email, password);
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="max-w-md min-h-scree flex flex-col w-full mx-auto justify-center">
        {/* Logo */}
        <div className="flex items-center mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
            <Notebook className="text-white" />
          </div>
          <span className="ml-2 text-xl font-bold uppercase">sfs-Kanban</span>
        </div>

        {/* Welcome text */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to start managing your tasks!</p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
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

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Register button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-500 hover:bg-blue-600"
            >
              Register
            </Button>

            {/* Login link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href={'/login'} className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-100 via-white to-indigo-200 relative overflow-hidden">
        <DashboardPreview />
      </div>
    </div>
  );
}
