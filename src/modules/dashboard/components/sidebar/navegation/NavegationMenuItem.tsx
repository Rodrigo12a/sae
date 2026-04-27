'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";

interface Props {
    path: string;
    icon: JSX.Element;
    title: string;
    subTitle: string;
    badge?: number | string;
}


export const SidebarMenuItem = ({ path, icon, title, subTitle, badge }: Props) => {

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

        <div className="flex flex-col flex-1">
            
            <div className="flex items-center justify-between gap-2">
                <span
                className={`text-sm font-semibold transition-colors
                ${pathName === path
                    ? "text-white"
                    : "text-slate-200 group-hover:text-white"}`}
                >
                {title}
                </span>

                {badge && (
                    <span className="bg-[#fbb03b] text-[#a10500] text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        {badge}
                    </span>
                )}
            </div>

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
