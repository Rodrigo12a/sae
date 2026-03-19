import { AuthTabs } from "@/modules/auth/components";
import Image from "next/image";




export default function LoginPage() {
  return (
    <div className="p-2 ">
      <header className="text-center space-y-3 mb-8">
      <div className="flex justify-center md:hidden">
        <Image
          src="/iconos/isotipo-color.png" 
          width={20}
          height={20}
          alt="logo" 
          className="w-28 h-28 object-contain mb-6"
        />
      </div>

      <h1 className="text-2xl font-semibold text-black">
        Sistema de Acompañamiento Estudiantil
      </h1>

      <p className="text-sm text-gray-600">
        Accede con tu cuenta institucional para continuar.
      </p>
      </header>
      <AuthTabs />
    </div>
  );
}