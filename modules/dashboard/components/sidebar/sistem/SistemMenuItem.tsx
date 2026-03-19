'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { JSX } from 'react'

interface Props {
    path: string,
    icon: JSX.Element,
    title: string
} 

export const SistemMenuItem = ( { path, icon, title  }: Props ) => {

    const pathName = usePathname();

  return (
    <Link className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition ${pathName === path ? "bg-[#a10500]" : ""}`} href={path}>
        {icon}
        <span className="text-sm font-medium">
          {title}
        </span>
      </Link>
  )
}
