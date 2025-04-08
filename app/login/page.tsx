// app/page.tsx
import LoginForm from '@/components/LoginForm';
import DashboardPreview from '@/components/DashboardPreview';
import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col p-10 md:p-16 lg:p-24">
        <LoginForm  />
      </div>

      {/* Right side - Dashboard preview */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-100 via-white to-indigo-200 relative overflow-hidden">
        <DashboardPreview />
      </div>
    </div>
  );
}