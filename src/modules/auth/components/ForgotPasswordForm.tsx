"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FiMail, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export function ForgotPasswordForm() {
  const { forgotPassword, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form
            key="forgot-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                <FiMail size={18} />
              </div>
              <input
                type="email"
                placeholder="nombre@institucion.edu.mx"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] transition-all placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100"
              >
                <FiAlertCircle className="shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/10 hover:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <>
                  Enviar enlace de recuperación
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 px-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3"
          >
            <div className="mx-auto w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
              <FiCheckCircle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-emerald-900 font-bold">¡Correo enviado!</h3>
              <p className="text-emerald-700 text-xs leading-relaxed">
                Hemos enviado las instrucciones a <strong>{email}</strong>. Revisa tu bandeja de entrada y spam.
              </p>
            </div>
            <button 
              onClick={() => setSuccess(false)}
              className="text-emerald-600 text-xs font-bold hover:underline"
            >
              ¿No recibiste nada? Reintentar
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

