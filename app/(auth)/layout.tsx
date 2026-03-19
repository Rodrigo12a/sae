import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* Sección Izquierda*/}
      <section className="hidden md:flex relative text-white items-center justify-center p-12 sticky top-0 h-screen overflow-hidden bg-gradient-to-br from-[#7A0000] via-[#A10500] to-[#D62828]">
        
        <div className="absolute w-[500px] h-[500px] bg-red-500 opacity-20 rounded-full blur-[120px] top-[-100px] left-[-100px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-amber-300 opacity-10 rounded-full blur-[100px] bottom-[-100px] right-[-100px] animate-pulse" />

        <div className="absolute w-72 h-72 bg-white/10 backdrop-blur-2xl rounded-full top-10 left-10 blur-3xl opacity-40 animate-float" />
        <div className="absolute w-96 h-96 bg-white/5 backdrop-blur-2xl rounded-full bottom-10 right-10 blur-3xl opacity-30 animate-float-slow" />
        <div className="absolute w-40 h-40 bg-white/10 backdrop-blur-xl rounded-full top-1/2 left-1/3 blur-2xl opacity-20 animate-float" />

        {/*  Textura */}
        <div className="absolute inset-0 opacity-10 bg-[url(/imagenes/noise-texture.png)] bg-cover" />
        
        {/*    //!Figuras animadas  */}
                  {/* Animated SVG background */}
                  <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="sae-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(251,176,59,0.07)" strokeWidth="0.5" />
              </pattern>
              <radialGradient id="sae-cglow" cx="50%" cy="48%" r="50%">
                <stop offset="0%"   stopColor="#fbb03b" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#fbb03b" stopOpacity="0"    />
              </radialGradient>
              <radialGradient id="sae-tglow" cx="50%" cy="0%" r="60%">
                <stop offset="0%"   stopColor="#ff5020" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#A10500"  stopOpacity="0"   />
              </radialGradient>
            </defs>
 
            {/* Grid */}
            <rect width="400" height="600" fill="url(#sae-grid)" />
 
            {/* Diagonal lines */}
            <line x1="0" y1="600" x2="400" y2="0" stroke="rgba(251,176,59,0.06)" strokeWidth="0.5" />
            <line x1="400" y1="600" x2="0" y2="0" stroke="rgba(251,176,59,0.06)" strokeWidth="0.5" />
 
            {/* Central glow */}
            <ellipse cx="200" cy="295" rx="180" ry="180" fill="url(#sae-cglow)">
              <animate attributeName="rx" values="180;200;170;180" dur="8s"  repeatCount="indefinite" />
              <animate attributeName="ry" values="180;170;200;180" dur="10s" repeatCount="indefinite" />
            </ellipse>
 
            {/* Top burst */}
            <ellipse cx="200" cy="0" rx="220" ry="160" fill="url(#sae-tglow)" />
 
            {/* Pulsing concentric rings */}
            <circle cx="200" cy="295" r="130" fill="none" stroke="rgba(251,176,59,0.12)" strokeWidth="0.5">
              <animate attributeName="r"       values="130;145;130" dur="6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.5;1"     dur="6s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="295" r="165" fill="none" stroke="rgba(251,176,59,0.07)" strokeWidth="0.5">
              <animate attributeName="r"       values="165;178;165" dur="8s" repeatCount="indefinite" begin="1s" />
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="8s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle cx="200" cy="295" r="200" fill="none" stroke="rgba(251,176,59,0.04)" strokeWidth="0.5">
              <animate attributeName="r" values="200;215;200" dur="10s" repeatCount="indefinite" begin="2s" />
            </circle>
            
            {/* Rotating dashed orbit */}
            <circle
              cx="200" cy="295" r="148"
              fill="none"
              stroke="rgba(251,176,59,0.15)"
              strokeWidth="0.5"
              strokeDasharray="6 10"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 295"
                to="360 200 295"
                dur="60s"
                repeatCount="indefinite"
              />
            </circle>
 
            {/* Orbiting dots */}
            <circle r="3" fill="rgba(251,176,59,0.7)">
              <animateMotion dur="12s" repeatCount="indefinite"
                path="M200,295 m-148,0 a148,148 0 1,1 296,0 a148,148 0 1,1 -296,0" />
            </circle>
            <circle r="2" fill="rgba(255,255,255,0.5)">
              <animateMotion dur="12s" repeatCount="indefinite" begin="-6s"
                path="M200,295 m-148,0 a148,148 0 1,1 296,0 a148,148 0 1,1 -296,0" />
            </circle>
 
            {/* Corner accent marks */}
            <line x1="0"   y1="80"  x2="0"   y2="0"   stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
            <line x1="0"   y1="0"   x2="80"  y2="0"   stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
            <line x1="400" y1="0"   x2="320" y2="0"   stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
            <line x1="400" y1="0"   x2="400" y2="80"  stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
            <line x1="0"   y1="520" x2="0"   y2="600" stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
            <line x1="0"   y1="600" x2="80"  y2="600" stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
            <line x1="400" y1="520" x2="400" y2="600" stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
            <line x1="320" y1="600" x2="400" y2="600" stroke="rgba(251,176,59,0.2)" strokeWidth="1" />
          </svg>

        {/*  //!Fin de figuras animadas  */}

        {/*  Contenido */}
        <div className="relative z-10 max-w-md text-center space-y-6 animate-fade-in">
        <Image 
          src={'/iconos/isotipo-blanco.png'} 
          width={100} 
          height={100} 
          alt="Isotipo SAE"
          className="mx-auto block drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
        />
          
          <p className="text-xl font-medium leading-relaxed">
            Gestiona tu trayectoria académica de forma inteligente
          </p>

          <p className="text-sm text-red-100">
            alcanza tus objetivos desde un solo lugar.
          </p>
        </div>

      </section>

      {/* Sección Derecha */}
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