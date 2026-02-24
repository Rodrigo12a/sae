import { AuthTabs } from "@/modules/auth/components/AuthTabs";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className=" px-6 py-10 md:px-10">
      <header className="text-center space-y-3 mb-8">
        <div className="flex justify-center">
          <img 
            src="/iconos/isotipo-claro.png" 
            alt="logo" 
            className="w-28 h-28 object-contain mb-6" />
        </div>

        <h1 className="text-2xl font-semibold text-black">
          Bienvenido al SAE
        </h1>

        <p className="text-sm text-black">
          Regístrate o inicia sesión a continuación para comenzar
        </p>
      </header>
      <AuthTabs />
    </div>
  );
}