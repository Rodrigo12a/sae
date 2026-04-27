/**
 * @page AdminDashboardAuditoriaRedirect
 * @description Redirige al módulo real de auditoría en /admin/auditoria
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuditoriaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/auditoria');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--text-muted)] text-sm font-medium">Cargando módulo de auditoría...</p>
      </div>
    </div>
  );
}
