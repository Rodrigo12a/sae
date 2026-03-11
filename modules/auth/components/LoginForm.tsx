"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "./PasswordInput";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales incorrectas");
      return;
    }

    const session = await getSession();
    const role = session?.user?.role ? String(session.user.role).toUpperCase() : null;

    switch (role) {
      case "ADMIN":
        router.push("/dashboard/main");
        break;
      case "DOCENTE":
        router.push("/dashboard/main");
        break;
      case "ALUMNO":
        router.push("/form");
        break;
      default:
        // Si no se pudo leer rol por alguna razón, al menos salimos del login.
        router.push("/dashboard");
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">

      {/* Botones Sociales */}
      <div className="space-y-3">
        <button className="w-full rounded-md border border-gray-300 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 font-medium shadow-sm">
          <img 
            src="/iconos/apple.png" 
            alt="Apple logo" 
            className="w-5 h-5 object-contain" 
          />
          Iniciar Sesión con Apple
        </button>
        
        <button className="w-full rounded-md border border-gray-300 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 font-medium shadow-sm">
          <img 
            src="/iconos/google.png" 
            alt="Google logo" 
            className="w-5 h-5 object-contain" 
          />
          Iniciar Sesión con Google
        </button>
      </div>

      {/* División */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex-1 h-px bg-gray-200" />
        O continuar con correo electrónico
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-[#A10500] focus:ring-1 focus:ring-[#A10500] outline-none transition-all shadow-sm"
        />

        <PasswordInput 
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        />
        
      </div>
      <div className="flex justify-end">
        <button 
        className="text-sm font-medium text-[#A10500] hover:text-red-800 transition-colors">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button 
      onClick={handleLogin}
      disabled={loading}
      className="w-full rounded-md bg-[#A10500] py-3 text-white font-semibold shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-[#fbb03b] active:scale-95 active:translate-y-0 active:shadow-sm">
      {loading ? "Ingresando..." : "Iniciar Sesión"}
      </button>

    </div>
  );
}