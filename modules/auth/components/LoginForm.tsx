"use client";

import { PasswordInput } from "./PasswordInput";

export function LoginForm() {
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
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Ingresa tu correo electrónico"
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-[#A10500] focus:ring-1 focus:ring-[#A10500] outline-none transition-all shadow-sm"
        />

        <PasswordInput />
      </div>
      <div className="flex justify-end">
        <button className="text-sm font-medium text-[#A10500] hover:text-red-800 transition-colors">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button className="w-full rounded-md bg-[#A10500] py-3 text-white font-semibold shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-[#fbb03b] active:scale-95 active:translate-y-0 active:shadow-sm">
        Iniciar Sesión
      </button>

    </div>
  );
}