'use client';

import { Sidebar } from '../../modules/dashboard/components';
import { Navbar } from '../../modules/dashboard/components/navbar/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div className="flex h-screen w-screen bg-[#F2F2F2] text-gray-600">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>

  );
}