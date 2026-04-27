import { Suspense } from 'react';
import { LoginForm } from "@/src/features/auth/ui/LoginForm";

export default function LoginPage() {
  return (
    // Esto "cura" el error de prerenderizado al aislar useSearchParams()
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-52 bg-gray-100 rounded-xl"></div>
    </div>
  );
}