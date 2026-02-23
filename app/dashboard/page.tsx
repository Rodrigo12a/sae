export default function DashboardPage() {
    return (
      <div className="space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold">Hola 👋</h1>
          <p className="text-sm text-gray-500">
            ¿Qué te gustaría hacer hoy?
          </p>
        </header>
  
        {/* Cards acciones */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Mi perfil"
            description="Administra tu información"
          />
          <ActionCard
            title="Configuración"
            description="Preferencias del sistema"
          />
          <ActionCard
            title="Soporte"
            description="¿Necesitas ayuda?"
          />
        </section>
      </div>
    );
  }
  
  function ActionCard({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) {
    return (
      <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow transition">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    );
  }