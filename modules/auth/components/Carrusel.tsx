'use client'
import  { useEffect, useState } from 'react'



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
export const Carrusel = () => {

    const [currentStep, setCurrentStep] = useState(0);

    
    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % instructions.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);


  return (
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
  )
}
