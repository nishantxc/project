// app/page.tsx
import LoginForm from '@/components/LoginForm';
import DashboardPreview from '@/components/DashboardPreview';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col p-10 md:p-16 lg:p-24">
        <LoginForm />
      </div>

      {/* Right side - Dashboard preview */}
      <div className="hidden md:block md:w-1/2 bg-gray-200 relative overflow-hidden">
        <DashboardPreview />
      </div>
    </div>
  );
}