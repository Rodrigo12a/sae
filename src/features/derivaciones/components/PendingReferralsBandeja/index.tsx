import React, { useState } from 'react';
import { usePendingReferrals } from '../../hooks/usePendingReferrals';
import { AcceptReferralModal } from '../AcceptReferralModal';
import { PendingReferral } from '../../types';
import { FiInbox, FiAlertCircle, FiClock, FiUser, FiFileText, FiCpu } from 'react-icons/fi';

/**
 * @module PendingReferralsBandeja
 * @epic EPICA-5
 * @hu HU014
 * @api GET /api/referrals/pending
 */
export const PendingReferralsBandeja: React.FC = () => {
  const { data: referrals, isLoading, isError, error, refetch } = usePendingReferrals();
  const [selectedReferral, setSelectedReferral] = useState<PendingReferral | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-32 bg-gray-200 animate-pulse rounded-lg shadow-sm" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-100 text-center">
        <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800">Error al cargar la bandeja</h3>
        <p className="text-sm text-red-600 mt-2 mb-4">
          {error?.message || 'No se pudieron recuperar las derivaciones pendientes.'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-medium rounded-md transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!referrals || referrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-[var(--psico-private-bg)] rounded-full flex items-center justify-center mb-4">
          <FiInbox className="w-8 h-8 text-[var(--psico-accent)]" />
        </div>
        <h3 className="text-xl font-medium text-gray-800">Bandeja vacía</h3>
        <p className="text-gray-500 mt-2">
          No hay casos derivados pendientes de aceptación en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {referrals.map((referral) => (
        <div 
          key={referral.id} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <FiClock className="w-3 h-3" />
                Pendiente de revisión
              </span>
               <span className="text-xs text-gray-500">
                {new Date(referral.createdAt).toLocaleDateString()}
              </span>
              {referral.aiValidation?.symptomatologyDetected && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white shadow-sm border border-purple-500">
                  <FiCpu className="w-3 h-3" />
                  IA: Sintomatología Detectada
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <FiUser className="text-gray-400" />
              {referral.studentName}
            </h3>
            
            <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-100">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <FiFileText className="w-3 h-3" />
                Motivo de Derivación
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {referral.descripcionObservable}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col justify-end sm:items-end gap-2 mt-4 sm:mt-0 min-w-[140px]">
            <button
              onClick={() => {
                // TODO: En el futuro podría abrir el expediente clínico (ej. navegar a /psicologo/caso/[id])
                console.log('Ver expediente de', referral.studentId);
              }}
              className="px-4 py-2 min-h-[44px] text-sm font-medium text-[var(--psico-accent)] bg-[var(--psico-private-bg)] hover:bg-purple-200 rounded-md transition-colors w-full sm:w-auto text-center"
            >
              Ver Expediente
            </button>
            <button
              onClick={() => setSelectedReferral(referral)}
              className="px-4 py-2 min-h-[44px] text-sm font-medium text-white bg-[var(--psico-accent)] hover:bg-purple-700 rounded-md transition-colors w-full sm:w-auto text-center"
            >
              Aceptar Caso
            </button>
          </div>
        </div>
      ))}

      {selectedReferral && (
        <AcceptReferralModal
          isOpen={!!selectedReferral}
          onClose={() => setSelectedReferral(null)}
          referralId={selectedReferral.id}
          studentName={selectedReferral.studentName}
        />
      )}
    </div>
  );
};
