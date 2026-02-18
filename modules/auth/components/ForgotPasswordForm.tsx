"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function ForgotPasswordForm() {
  const { forgotPassword, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword({ email });
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 placeholder-gray-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p className="text-black-500 text-sm">{error}</p>}
      {success && (
        <p className="text-gray-500 text-sm">
          Revisa tu correo para continuar
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2"
      >
        {loading ? "Sending..." : "Send recovery email"}
      </button>
    </form>
  );
}
