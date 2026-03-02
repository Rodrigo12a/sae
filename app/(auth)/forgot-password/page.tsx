import Link from "next/link";
import { ForgotPasswordForm } from "@/modules/auth/components";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl text-black font-semibold">Recuperar contraseña</h1>
        <p className="text-sm text-gray-500">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-sm text-center">
        <Link href="/login" className="text-blue-600 hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
