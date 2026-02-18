import Link from "next/link";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl text-black font-semibold">Crear cuenta</h1>
        <p className="text-sm text-gray-500">Regístrate para acceder a SAE</p>
      </div>

      <RegisterForm />

      <p className="text-sm text-center">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}