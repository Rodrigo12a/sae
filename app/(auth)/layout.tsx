export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow">
          <div className="mb-6 text-center">
            <h2 className="text-3xl text-black font-bold">SAE</h2>
            <p className="text-sm text-gray-500">Sistema de Acompañamiento Estudiantil</p>
          </div>
  
          {children}
  
          <footer className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} SAE
          </footer>
        </div>
      </div>
    );
  }