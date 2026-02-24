"use client";

import { useState } from "react";
// import { useAuth } from "../hooks/useAuth"; // Descomenta cuando conectes el backend
import { PasswordInput } from "./PasswordInput";

export function RegisterForm() {
  const [password, setPassword] = useState("");

  // Validaciones en tiempo real
  const hasMinLength = password.length > 8;
  const hasNumber = /\d/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-[#A10500] focus:ring-1 focus:ring-[#A10500] outline-none transition-all shadow-sm"
        />

        <input
          type="email"
          placeholder="Ingresa tu correo electrónico"
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-[#A10500] focus:ring-1 focus:ring-[#A10500] outline-none transition-all shadow-sm"
        />

        <PasswordInput 
          placeholder="Crea una contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex flex-col gap-2 px-1 py-2 text-sm">
          <ValidationItem isValid={hasMinLength} text="Más de 8 caracteres" />
          <ValidationItem isValid={hasNumber} text="Al menos un número" />
          <ValidationItem isValid={hasMixedCase} text="Al menos una mayúscula y una minúscula" />
          <ValidationItem isValid={hasSpecialChar} text="Al menos un carácter especial (#, $, %, etc.)"/>
        </div>

        <PasswordInput placeholder="Confirma tu contraseña" />
      </div>

      <button className="w-full rounded-md bg-[#A10500] py-3 text-white font-semibold shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-[#fbb03b] active:scale-95 active:translate-y-0 active:shadow-sm">
        Registrarse
      </button>
    </div>
  );
}

// Sub-componente para hacer los "checkbox" dinámicos y limpios
function ValidationItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 transition-colors duration-300 ${isValid ? "text-green-600" : "text-gray-500"}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
      >
        {isValid ? (
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 1.5a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" clipRule="evenodd" />
        )}
      </svg>
      <span>{text}</span>
    </div>
  );
}