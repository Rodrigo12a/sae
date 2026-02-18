import Link from "next/link";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl text-black font-semibold">Iniciar sesión</h1>
        <p className="text-sm text-gray-500">Accede al sistema SAE</p>
      </div>

      <LoginForm />

      <div className="flex justify-between text-sm">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link href="/register" className="text-blue-600 hover:underline">
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}