"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);

  const instructions = [
    {
      title: "Conéctate",
      description: "Accede con tu cuenta institucional para personalizar tu perfil.",
      image: "/iconos/seguro.png"
    },
    {
      title: "Monitorea",
      description: "Revisa tu estatus académico y detecta oportunidades a tiempo.",
      image: "/iconos/lupa.png"
    },
    {
      title: "Impúlsate",
      description: "Recibe planes de acción diseñados para asegurar tu graduación.",
      image: "/iconos/graduacion.png"
    }
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % instructions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#A10500]">
      
      {/* Sección Izquierda: Branding y Carrusel */}
      <section className="hidden md:flex relative text-white items-center justify-center p-12 sticky top-0 h-screen overflow-hidden">
        
        <div className="relative z-10 max-w-md w-full space-y-8 text-center transition-all duration-500">
          <div className="text-4xl font-bold mb-4">SAE</div>
          
          <div className="h-44 m-10 flex items-center justify-center">
            <img 
              src={instructions[currentStep].image} 
              alt="Instrucción"
              className="max-h-full object-contain animate-fade-in" 
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{instructions[currentStep].title}</h2>
            <p className="text-lg opacity-80 min-h-[60px]">
              {instructions[currentStep].description}
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            {instructions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentStep === index ? "bg-white w-6" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 opacity-10 bg-[url('/textura-monkqi.png')] bg-cover" />
      </section>

      <section className="flex flex-col bg-[#F2F2F2] min-h-screen">
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 px-6 pb-4">
          Al registrarte, aceptas nuestros{' '}
          <Link 
            href="/terminos-y-condiciones" 
            className="text-[#A10500] underline hover:text-red-800 transition-colors"
          >
            Términos, condiciones y políticas de privacidad
          </Link>
          .
        </div> 

        <footer className="pb-8 text-center text-xs text-gray-400 px-6">
          © {new Date().getFullYear()} SAE por Universidad Politécnica del Estado de Tlaxcala
        </footer>
      </section>

    </div>
  );
}