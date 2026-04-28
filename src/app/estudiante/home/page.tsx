/**
 * @module EstudianteHomePage
 * @epic EPICA-1 Onboarding y Módulo Estudiantil
 * @hu HU018 — Dashboard del Estudiante y Flyers informativos
 * @description Landing page para estudiantes con avisos, becas y acceso a encuestas.
 */

'use client';

import React, { useState } from 'react';
import { FiStar, FiAward, FiHeart, FiBookOpen, FiArrowRight, FiCheckCircle, FiLock, FiEye, FiShield } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EstudianteHomePage() {
  const [showOnboarding, setShowOnboarding] = useState(true); // Simulación de primer login
  const [step, setStep] = useState(1); // 1: Password Change, 2: Welcome

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Contraseña actualizada correctamente');
    setStep(2);
  };

  const flyers = [
    { 
      id: 1, 
      title: 'Becas de Manutención 2026', 
      description: 'Ya está abierta la convocatoria para el programa de apoyo económico. ¡Aplica hoy!',
      category: 'Becas',
      color: 'bg-blue-600',
      icon: <FiAward />
    },
    { 
      id: 2, 
      title: 'Torneo Relámpago de Futbol', 
      description: 'Inscribe a tu equipo para la copa inter-carreras de este cuatrimestre.',
      category: 'Deportes',
      color: 'bg-green-600',
      icon: <FiStar />
    },
    { 
      id: 3, 
      title: 'Talleres de Manejo de Estrés', 
      description: 'Sesiones semanales con el departamento de psicología para mejorar tu bienestar.',
      category: 'Salud',
      color: 'bg-purple-600',
      icon: <FiHeart />
    },
    { 
      id: 4, 
      title: 'Cursos de Inglés Sabatinos', 
      description: 'Refuerza tu nivel de idiomas con nuestros cursos extracurriculares gratuitos.',
      category: 'Programas',
      color: 'bg-orange-600',
      icon: <FiBookOpen />
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-secondary)] text-white p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            ¡Hola de nuevo, <span className="text-blue-300">Estudiante</span>!
          </h1>
          <p className="text-lg text-white/80 mb-8 font-medium leading-relaxed">
            Tu bienestar y éxito académico son nuestra prioridad. Aquí encontrarás avisos importantes y recursos para tu formación.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/estudiante/encuesta" 
              className="px-8 py-3.5 bg-white text-[var(--color-primary)] rounded-2xl font-black hover:bg-[var(--bg-section)] transition-all flex items-center gap-2 shadow-xl"
            >
              Completar Encuesta SAE <FiArrowRight />
            </Link>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Stats/Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estatus de Cuenta</p>
            <p className="text-lg font-bold text-gray-900">Activa y Verificada</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FiBookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Periodo Actual</p>
            <p className="text-lg font-bold text-gray-900">Mayo - Agosto 2026</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <FiStar size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Próxima Evaluación</p>
            <p className="text-lg font-bold text-gray-900">15 de Mayo</p>
          </div>
        </div>
      </div>

      {/* Flyers Section */}
      <section>
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Avisos y Oportunidades</h2>
            <p className="text-gray-500 font-medium">Flyers informativos sobre programas vigentes.</p>
          </div>
          <button className="text-sm font-bold text-[var(--brand-primary)] hover:underline">Ver todo el boletín</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flyers.map((flyer) => (
            <div 
              key={flyer.id} 
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className={`h-32 ${flyer.color} p-6 flex items-end relative overflow-hidden`}>
                <div className="absolute top-4 right-4 text-white/20 scale-[3] rotate-12 group-hover:scale-[4] group-hover:rotate-0 transition-all duration-500">
                  {flyer.icon}
                </div>
                <span className="relative z-10 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                  {flyer.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-[var(--text-primary)] text-lg leading-tight mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                  {flyer.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                  {flyer.description}
                </p>
                <button className="w-full py-2.5 bg-[var(--bg-section)] text-[var(--text-primary)] rounded-xl text-xs font-black uppercase tracking-widest group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all">
                  Saber Más
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-[var(--bg-section)] rounded-[2rem] p-8 flex flex-col sm:flex-row items-center gap-8 border border-[var(--border-subtle)]">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[var(--brand-primary)] shadow-sm flex-shrink-0">
          <FiHeart size={32} />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">¿Necesitas hablar con alguien?</h3>
          <p className="text-[var(--text-secondary)] mt-1 max-w-xl">
            El departamento de psicología y salud está disponible para apoyarte en cualquier situación personal o académica que estés enfrentando.
          </p>
        </div>
        <button className="px-6 py-3 bg-white text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-2xl font-bold hover:bg-[var(--bg-section)] transition-all sm:ml-auto">
          Contactar Apoyo
        </button>
      </section>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[var(--sidebar-bg)]/60 backdrop-blur-md" />
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
            {step === 1 ? (
              <div className="p-8 sm:p-12">
                <div className="w-16 h-16 bg-[var(--bg-section)] text-[var(--brand-primary)] rounded-2xl flex items-center justify-center mb-6">
                  <FiLock size={32} />
                </div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Cambio de Contraseña Obligatorio</h2>
                <p className="text-[var(--text-secondary)] font-medium mt-2 leading-relaxed">
                  Para proteger tu cuenta, es necesario que actualices la contraseña temporal asignada por tu tutor.
                </p>

                <form onSubmit={handlePasswordChange} className="mt-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Nueva Contraseña</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-2xl focus:bg-white focus:border-[var(--brand-primary)] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Confirmar Contraseña</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-2xl focus:bg-white focus:border-[var(--brand-primary)] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button className="w-full py-4 bg-[var(--brand-primary)] text-white rounded-2xl font-black shadow-xl shadow-[var(--brand-primary)]/20 hover:opacity-90 transition-all mt-4">
                    Actualizar y Continuar
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 bg-[var(--bg-section)] text-[var(--semaforo-verde)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">¡Cuenta Activada!</h2>
                <p className="text-[var(--text-secondary)] font-medium mt-2 leading-relaxed">
                  Bienvenido al Sistema de Abandono Escolar (SAE). Tu cuenta ha sido configurada con éxito.
                </p>
                <div className="mt-8 p-6 bg-[var(--bg-section)] rounded-2xl border border-[var(--border-subtle)] text-left flex gap-4">
                  <div className="shrink-0 p-2 bg-white rounded-xl text-[var(--brand-primary)] shadow-sm h-fit">
                    <FiShield />
                  </div>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium">
                    No olvides completar tu encuesta de salud y socioeconómica en la sección "Encuestas".
                  </p>
                </div>
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="w-full py-4 bg-[var(--text-primary)] text-white rounded-2xl font-black shadow-xl hover:opacity-90 transition-all mt-8"
                >
                  Ir al Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
