'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";

interface Props {
    path: string;
    icon: JSX.Element;
    title: string;
    subTitle: string;
}


export const SidebarMenuItem = ({ path, icon, title, subTitle }: Props) => {

    const pathName = usePathname();

  return (
    <Link
        href={path}
        className={`group flex items-center w-full gap-3 px-3 py-3 rounded-lg
        transition-all duration-200
        hover:bg-[#fbb03b]/10
        ${pathName === path ? "bg-[#a10500]" : ""}`}
        >

        <div
            className={`text-lg transition-colors
            ${pathName === path 
            ? "text-white"
            : "text-slate-400 group-hover:text-[#fbb03b]"}`}
        >
            {icon}
        </div>

        <div className="flex flex-col">
            
            <span
            className={`text-sm font-semibold transition-colors
            ${pathName === path
                ? "text-white"
                : "text-slate-200 group-hover:text-white"}`}
            >
            {title}
            </span>

            <span
            className={`text-xs hidden md:block transition-colors
            ${pathName === path
                ? "text-white/70"
                : "text-slate-400 group-hover:text-[#fbb03b]"}`}
            >
            {subTitle}
            </span>

        </div>

    </Link>
  )
}
