'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiBell, FiChevronDown } from "react-icons/fi";

export const Navbar = () => {

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  return (

    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <h1 className="text-lg font-semibold text-slate-700">
          Dashboard
        </h1>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* NOTIFICATIONS */}
        <button className="relative text-slate-500 hover:text-[#fbb03b] transition-colors">

          <FiBell size={20} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#a10500] rounded-full"></span>

        </button>

        {/* USER MENU */}
        <div ref={dropdownRef} className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 rounded-lg transition"
          >

            <Image
              src="/imagenes/profile.jpg"
              alt="profile"
              width={32}
              height={32}
              className="rounded-full"
            />

            <span className="text-sm font-medium text-slate-700 hidden md:block">
              Maria Luisa
            </span>

            <FiChevronDown
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />

          </button>

          {/* DROPDOWN */}
          {open && (

            <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">

              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-slate-600 hover:bg-[#fbb03b]/10 hover:text-[#a10500]"
              >
                Mi perfil
              </Link>

              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm text-slate-600 hover:bg-[#fbb03b]/10 hover:text-[#a10500]"
              >
                Configuración
              </Link>

              <div className="border-t border-slate-200" />

              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Cerrar sesión
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
};