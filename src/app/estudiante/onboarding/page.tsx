/**
 * @module OnboardingPage
 * @epic EPICA-6 Onboarding y Experiencia del Estudiante
 * @hu HU007, HU018 — Onboarding y cambio de contraseña
 * @description Pantalla de primer ingreso para estudiantes.
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiCheckCircle, FiArrowRight, FiShield, FiHeart, FiStar } from 'react-icons/fi';
import Image from 'next/image';

export default function StudentOnboardingPage() {
  const [step, setStep] = useState(1); // 1: Welcome, 2: Password Change, 3: Success
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      setStep(3);
    }
  };

  const handleFinish = () => {
    router.push('/estudiante/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-indigo-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-white/50 p-8 md:p-12 relative z-10 transition-all duration-500">
        
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-3xl mb-4">
                <FiStar className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">¡Bienvenido a SAE!</h1>
              <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                Estamos aquí para acompañarte en tu trayectoria académica y asegurar que tengas todo el apoyo que necesitas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <FiHeart />, title: 'Apoyo', text: 'Atención psicológica y médica' },
                { icon: <FiShield />, title: 'Privacidad', text: 'Tus datos están protegidos' },
                { icon: <FiCheckCircle />, title: 'Éxito', text: 'Herramientas para tu egreso' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                  <div className="text-indigo-600 flex justify-center">{item.icon}</div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{item.text}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-200"
            >
              Comenzar configuración <FiArrowRight />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <div className="inline-flex p-4 bg-orange-50 text-orange-600 rounded-3xl mb-4">
                <FiLock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Seguridad de tu Cuenta</h2>
              <p className="text-slate-500 mt-2">Como es tu primer ingreso, es obligatorio actualizar tu contraseña.</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-sm mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest px-2">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    required
                    minLength={8}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest px-2">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs font-bold text-center">Las contraseñas no coinciden</p>
              )}

              <button 
                type="submit"
                disabled={!newPassword || newPassword !== confirmPassword || newPassword.length < 8}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Actualizar y Continuar
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full blur-[40px] opacity-20 animate-pulse" />
              <div className="relative inline-flex p-6 bg-green-50 text-green-600 rounded-[2rem] mb-6">
                <FiCheckCircle className="w-16 h-16" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">¡Todo listo!</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                Tu cuenta ha sido configurada correctamente. Ahora puedes acceder a tu panel y completar tus encuestas.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-left space-y-3">
              <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                <FiStar /> Tip para tu éxito
              </h4>
              <p className="text-blue-700/80 text-xs leading-relaxed">
                Recuerda que completar tus encuestas de seguimiento a tiempo nos permite brindarte mejores servicios de apoyo académico y personal.
              </p>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
            >
              Ir a mi Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-12 flex gap-3">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-12 bg-indigo-600' : 'w-4 bg-slate-300'}`} 
          />
        ))}
      </div>
    </div>
  );
}
