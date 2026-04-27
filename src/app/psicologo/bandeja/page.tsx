'use client';

import React from 'react';
import { PendingReferralsBandeja } from '@/src/features/derivaciones/components/PendingReferralsBandeja';
import { FiInbox } from 'react-icons/fi';

export default function BandejaPsicologoPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <span className="p-2 bg-[var(--psico-private-bg)] text-[var(--psico-accent)] rounded-lg">
              <FiInbox className="w-6 h-6" />
            </span>
            Bandeja de Entrada
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Gestiona las derivaciones pendientes asignadas al departamento de Psicología.
          </p>
        </div>
      </div>

      <main>
        <PendingReferralsBandeja />
      </main>
    </div>
  );
}
