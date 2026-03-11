"use client";

import Link from "next/link";
import { JSX } from "react";
import { signOut } from "next-auth/react";

interface Props {
  path?: string;
  icon?: JSX.Element;
  title: string;
  onClick?: () => void;
}

export const ButtonLogout = ({ path, icon, title, onClick }: Props) => {

  const handleAction = () => {
    if (onClick) return onClick();
    if (path === "/logout") {
      signOut({ callbackUrl: "/login" });
    }
  };

  const baseStyle =
    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors";

  const style =
    "bg-[#a10500] text-white hover:bg-[#a10500]/90";

  if (path && path !== "/logout") {
    return (
      <Link href={path} className={`${baseStyle} ${style}`}>
        {icon}
        {title}
      </Link>
    );
  }

  return (
    <button
      onClick={handleAction}
      className="group flex items-center gap-3 w-full px-3 py-2 rounded-lg 
      text-slate-400 hover:text-white hover:bg-[#a10500]/60
      transition-colors"
    >
      <span className="text-lg group-hover:text-[#fbb03b]">
        {icon}
      </span>

      <span className="text-sm font-medium">
        {title}
      </span>
    </button>
  );
};