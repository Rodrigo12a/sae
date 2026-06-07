import Link from "next/link";
import { ForgotPasswordForm } from "@/src/modules/auth/components";
import { FiUsers, FiShield, FiHelpCircle, FiMail } from "react-icons/fi";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in">
      {/* Encabezado *
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100 shadow-sm">
          <FiHelpCircle className="text-[var(--color-primary)] text-2xl" />
        </div>
        <h1 className="text-2xl text-slate-900 font-bold tracking-tight">Recuperar acceso</h1>
        <p className="text-sm text-slate-500 max-w-[280px] mx-auto leading-relaxed">
          Ingresa tu correo institucional para recibir un enlace de recuperación
        </p>
      </div>
      */}

      {/* Formulario *
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <ForgotPasswordForm />
      </div>
      */}
      {/* Sección de ayuda adicional */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h1 className=" text-center text-2xl text-slate-900 font-bold tracking-tight">¿Necesitas ayuda?</h1>

        <div className="grid grid-cols-1 gap-3">
          {/* Estudiante */}
          <div className="group bg-dark-50/50 hover:bg-red-50 p-4 rounded-xl border border-blue-100/50 transition-all">
            <div className="flex items-start gap-3">
              <div className="bg-[var(--color-primary)] text-white p-2 rounded-lg shrink-0 shadow-sm">
                <FiUsers size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900">Soy Estudiante</h4>
                <p className="text-xs text-red-800/80 leading-relaxed mt-1">
                  Comunícate con tu <strong>tutor asignado</strong> para que pueda orientarte en el restablecimiento de tu acceso.
                </p>
              </div>
            </div>
          </div>
          {/* Personal Especializado */}
          <div className="group bg-red-50/50 hover:bg-red-100 p-4 rounded-xl border border-red-100/50 transition-all">
            <div className="flex items-start gap-3">
              <div className="bg-[var(--color-primary)] text-white p-2 rounded-lg shrink-0 shadow-sm">
                <FiShield size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-900">Tutor, Médico o Psicólogo</h4>
                <p className="text-xs text-red-800/80 leading-relaxed mt-1">
                  Acércate al administrador o envía un correo directamente a:
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)]">
                  <FiMail size={14} />
                  <a href="mailto:contacto@uptx.edu.mx" className="hover:underline transition-all">
                    contacto@uptx.edu.mx
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      <p className="text-sm text-center">
        <Link href="/auth/login" className="text-slate-600 font-medium hover:text-[var(--color-primary)] transition-all flex items-center justify-center gap-2">
          Volver a iniciar sesión
        </Link>
      </p>
    </div >
  );
}


