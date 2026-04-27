/**
 * @module TutorStudentPage
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU004, HU005, HU006
 * @ux UXDT-06 a UXDT-15
 * @qa QA-01 (privacidad diferencial) · QA-03 (sin datos clínicos en DOM)
 * @api GET /students/:id/risk-profile · POST /alerts/:id/followup · PUT /alerts/:id/close
 * @privacy Solo rol tutor — datos de salud filtrados por tipo y filterHealthByRole()
 */

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RiskProfilePanel } from '@/src/features/dashboard-tutor/components/RiskProfilePanel';
import { FollowUpForm } from '@/src/features/dashboard-tutor/components/FollowUpForm';
import { CloseAlertFlow } from '@/src/features/dashboard-tutor/components/CloseAlertFlow';
import { PsychologyReferralModal } from '@/src/features/derivaciones/components/PsychologyReferralModal';
import { MedicalReferralModal } from '@/src/features/derivaciones/components/MedicalReferralModal';

type ActiveModal = 'none' | 'followup' | 'close' | 'psychology' | 'medical';

export default function TutorStudentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const studentId = params.id;

  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  // En un caso real el alertId activo se obtendría del perfil
  const activeAlertId = 'alert-001'; // TODO: obtener del perfil cargado

  const handleBack = () => router.back();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navegación */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={handleBack}
            className="
              p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500
              min-w-[44px] min-h-[44px] flex items-center justify-center
            "
            aria-label="Regresar al Dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            Perfil del estudiante
          </h1>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="max-w-3xl mx-auto px-6 py-6">
        <RiskProfilePanel
          studentId={studentId}
          onFollowUp={() => setActiveModal('followup')}
          onCloseAlert={() => setActiveModal('close')}
          onReferToPsychology={() => setActiveModal('psychology')}
          onReferToMedical={() => setActiveModal('medical')}
        />
      </div>

      {/* Modal de Seguimiento (HU005) */}
      {activeModal === 'followup' && (
        <ModalWrapper
          title="Registrar seguimiento"
          onClose={() => setActiveModal('none')}
        >
          <FollowUpForm
            alertId={activeAlertId}
            studentName="Estudiante"
            onSuccess={() => setActiveModal('none')}
            onCancel={() => setActiveModal('none')}
          />
        </ModalWrapper>
      )}

      {/* Modal de Cierre (HU006) */}
      {activeModal === 'close' && (
        <ModalWrapper
          title="Cerrar alerta"
          onClose={() => setActiveModal('none')}
        >
          <CloseAlertFlow
            alertId={activeAlertId}
            studentName="Estudiante"
            onSuccess={() => setActiveModal('none')}
            onCancel={() => setActiveModal('none')}
          />
        </ModalWrapper>
      )}

      {/* Modal de Derivación a Psicología (HU012) */}
      <PsychologyReferralModal
        isOpen={activeModal === 'psychology'}
        onClose={() => setActiveModal('none')}
        studentId={studentId}
        studentName="Estudiante" // TODO: obtener del perfil
        activeAlertId={activeAlertId}
      />

      {/* Modal de Derivación a Servicios Médicos (HU013) */}
      <MedicalReferralModal
        isOpen={activeModal === 'medical'}
        onClose={() => setActiveModal('none')}
        studentId={studentId}
        studentName="Estudiante" // TODO: obtener del perfil
        alertId={activeAlertId}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Wrapper de modal
// ─────────────────────────────────────────────────────────────────────────────

function ModalWrapper({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="
              p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-blue-500
              min-w-[44px] min-h-[44px] flex items-center justify-center
            "
            aria-label="Cerrar diálogo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
