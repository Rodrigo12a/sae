"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthTabs() {
  const [active, setActive] = useState<"login" | "register">("login");

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="relative border-b flex">
        <button
          type="button"
          onClick={() => setActive("login")}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            active === "login"
              ? "text-red-700"
              : "text-gray-400"
          }`}
        >
          Iniciar Sesión
        </button>

        <button
          type="button"
          onClick={() => setActive("register")}
          className={`flex-1 pb-3 text-sm font-medium transition-colors hover ${
            active === "register"
              ? "text-[#A10500]"
              : "text-gray-400"
          }`}
        >
          Registrarse
        </button>

        {/* Línea animada */}
        <span
          className={`absolute bottom-0 h-[2px] w-1/2 bg-[#A10500] transition-transform duration-300 ${
            active === "login"
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        />
      </div>

      {/* Contenido animado */}
      <div className="relative overflow-hidden">
        <div
          className={`flex w-[200%] transition-transform duration-300 ease-in-out ${
            active === "login"
              ? "translate-x-0"
              : "-translate-x-1/2"
          }`}
        >
          <div className="w-1/2 pr-4">
            <LoginForm />
          </div>
          <div className="w-1/2 pl-4">
            <RegisterForm />
          </div>
        </div>
      </div>

    </div>
  );
}