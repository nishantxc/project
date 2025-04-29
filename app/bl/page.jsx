"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2">
      <div className="flex flex-col justify-center w-1/2">


        <div className="mb-10">
          <h1 className="text-8xl font-bold">BL</h1>
          <h2 className="text-2xl font-bold mt-2">BLACKLISTED</h2>
          <h3 className="text-xl font-bold">BUSINESS PRO</h3>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">Launch Your Store</h2>
          <p className="text-gray-400 mb-6">
            Build your store on Blacklisted and reach your customers without the middleman.
          </p>
          
          <div className="flex space-x-2 mt-8">
            <div className="w-8 h-1 bg-white"></div>
            <div className="w-8 h-1 bg-gray-700"></div>
            <div className="w-8 h-1 bg-gray-700"></div>
          </div>
        </div>
      </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center p-10 w-1/2">
        <div className="max-w-md mx-auto w-full">
          <div className=" rounded-2xl h-[150%] bg-gradient-to-b from-zinc-900 via-black to-black border-t border-x border-gradient-to-b p-8">
            <h2 className="text-2xl font-bold mb-2">Log Into Account</h2>
            <p className="text-gray-400 mb-6">
              Welcome to Blacklisted, please enter your login details to access your account.
            </p>

            <form className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    className="bg-zinc-800 border-zinc-700 pl-10 py-6"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="bg-zinc-800 border-zinc-700 pl-10 py-6"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-blue-500 hover:text-blue-400 text-sm">
                  Forgot password?
                </a>
              </div>

              <Button className="w-full bg-white rounded-full text-black hover:text-white py-6">
                Log into account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}