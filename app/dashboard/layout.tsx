export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-zinc-50 flex">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-64 bg-white border-r p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">SAE</h2>
  
            <nav className="space-y-3 text-sm">
              <a href="/dashboard" className="block font-medium">
                Inicio
              </a>
              <a href="/dashboard/profile" className="block">
                Perfil
              </a>
              <a href="/dashboard/settings" className="block">
                Configuración
              </a>
            </nav>
          </div>
        </aside>
  
        {/* Main */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    );
  }