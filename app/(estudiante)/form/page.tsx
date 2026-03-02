
"use client";

import { signOut } from "next-auth/react";

export default function FormPage() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Formulario para estudiante</h1>
      <button
        onClick={handleLogout}
        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
}