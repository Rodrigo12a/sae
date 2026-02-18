"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function RegisterForm() {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Name"
        className="w-full border p-2 placeholder-gray-300"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 placeholder-gray-300"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 placeholder-gray-300"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2"
      >
        {loading ? "Loading..." : "Create account"}
      </button>
    </form>
  );
}
