/**
 * @module LoginPage
 * @hu HU001
 * @description Punto de entrada para la autenticación SSO.
 */

import { Suspense } from "react";
import { LoginForm } from "@/src/features/auth/ui/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
