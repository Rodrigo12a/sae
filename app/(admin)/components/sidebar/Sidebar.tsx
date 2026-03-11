import Image from "next/image"
import { SidebarMenuItem } from "./navegation/NavegationMenuItem"
import { FaUserGraduate } from "react-icons/fa"
import { MdBarChart } from "react-icons/md"
import { TbChartDots3Filled } from "react-icons/tb"
import { PiChartScatterBold } from "react-icons/pi"
import { SistemMenuItem } from "./sistem/SistemMenuItem"
import { ButtonLogout } from "@/modules/auth/components"
import { FiLogOut } from "react-icons/fi"

const navegationItems = [
  {
    path: '/dashboard/main',
    icon: <MdBarChart/>,
    title: 'Dashboard',
    subTitle: 'Mi dashboard'
  },
  {
    path: '/dashboard/estudiantes',
    icon: <FaUserGraduate/>,
    title: 'Estudiantes',
    subTitle: 'Mi dashboard'
  },
  {
    path: '/dashboard/derivaciones',
    icon: <TbChartDots3Filled/>,
    title: 'Derivaciones',
    subTitle: 'Mi dashboard'
  }

]

const SistemItems = [
  {
    path: '/dashboard/machine-lerning',
    icon: <PiChartScatterBold/>,
    title: 'Machine Lerning',
  },
]

export const Sidebar = () => {
  return (
    <div className="flex flex-col w-72 h-screen bg-[#1c1c1c] text-slate-200 border-r border-slate-800">

    {/* LOGO */}
    <div className="flex flex-col items-center gap-3 px-6 py-5 border-b border-slate-800">
      <Image
        src="/iconos/logo-blanco.png"
        alt="logo"
        width={180}
        height={180}
      />
    </div>
  
    {/* PROFILE */}
    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
      <Image
        className="rounded-full"
        src="/imagenes/profile.jpg"
        alt="profile"
        width={36}
        height={36}
      />
  
      <div className="flex flex-col">
        <span className="text-sm font-semibold">
          Maria Luisa
        </span>
        <span className="text-xs text-slate-400">
          Administradora
        </span>
      </div>
    </div>
  
    {/* NAVIGATION */}
    <nav className="flex-1 px-4 py-4 overflow-y-auto">
  
      <p className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Navegación
      </p>
  
      <div className="space-y-1">
        {navegationItems.map((item) => (
          <SidebarMenuItem key={item.path} {...item} />
        ))}
      </div>
  
      {/* Secondary */}
      <p className="px-2 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Sistema
      </p>
        
      {
        SistemItems.map( item => (
          <SistemMenuItem key={item.path} { ...item }/>
        ))
      }
      
    </nav>

    {/* LOGOUT */}
  <div className="p-4 border-t border-slate-800">
    <ButtonLogout
      title="Cerrar sesión"
      icon={<FiLogOut />}
      path="/logout"
    />
  </div>
      
  </div>
  )
}
