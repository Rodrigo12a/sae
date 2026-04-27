/**
 * @module TutorTutoradosPage
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU007
 * @ux UXDT-16, UXDT-17
 * @api GET /tutor/tutorados · POST /tutor/tutorados · PUT /tutor/tutorados/:matricula
 * @privacy ⚠️ La página NO muestra ni almacena contraseñas. El formulario las limpia al cerrar.
 */

'use client';

import React, { useState } from 'react';
import { useTutorados } from '@/src/features/dashboard-tutor/hooks/useTutorados';
import { TutoradoForm } from '@/src/features/dashboard-tutor/components/TutoradoForm';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import type { TutoradoItem, CreateTutoradoRequest, UpdateTutoradoRequest } from '@/src/types/tutorado';

type ActivePanel = 'none' | 'create' | 'edit';

export default function TutorTutoradosPage() {
  const {
    tutorados,
    isLoading,
    error,
    isSubmitting,
    submitError,
    refetch,
    handleCreate,
    handleUpdate,
  } = useTutorados();

  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [selectedTutorado, setSelectedTutorado] = useState<TutoradoItem | null>(null);

  const openCreatePanel = () => {
    setSelectedTutorado(null);
    setActivePanel('create');
  };

  const openEditPanel = (tutorado: TutoradoItem) => {
    setSelectedTutorado(tutorado);
    setActivePanel('edit');
  };

  const handleClose = () => {
    setActivePanel('none');
    setSelectedTutorado(null);
    // El TutoradoForm limpiará sus contraseñas en su useEffect cleanup al desmontar
  };

  const handleFormSubmit = async (
    data: CreateTutoradoRequest | UpdateTutoradoRequest,
  ) => {
    let success = false;
    if (activePanel === 'create') {
      success = await handleCreate(data as CreateTutoradoRequest);
    } else if (activePanel === 'edit' && selectedTutorado) {
      success = await handleUpdate(selectedTutorado.matricula, data as UpdateTutoradoRequest);
    }
    if (success) {
      setTimeout(handleClose, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Tutorados</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Gestiona las cuentas de acceso de tus estudiantes al portal SAE.
            </p>
          </div>
          <button
            onClick={openCreatePanel}
            className="
              flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors min-h-[44px] shrink-0
            "
            aria-label="Agregar nuevo tutorado"
          >
            <span aria-hidden="true">+</span>
            Agregar tutorado
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Estado: Loading */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} showAvatar lines={2} />
            ))}
          </div>
        )}

        {/* Estado: Error */}
        {!isLoading && error && (
          <div role="alert" className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-3xl mb-3" aria-hidden="true">⚠️</span>
            <p className="text-sm font-semibold text-red-700 mb-1">No se pudo cargar la lista</p>
            <p className="text-xs text-gray-500 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 min-h-[44px]"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: Vacío */}
        {!isLoading && !error && tutorados.length === 0 && (
          <div role="status" className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3" aria-hidden="true">👥</span>
            <p className="text-base font-semibold text-gray-700 mb-1">Sin tutorados registrados</p>
            <p className="text-sm text-gray-400 mb-5">
              Comienza registrando la matrícula y contraseña de acceso de tus estudiantes.
            </p>
            <button
              onClick={openCreatePanel}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 min-h-[44px]"
            >
              + Agregar primer tutorado
            </button>
          </div>
        )}

        {/* Lista de tutorados */}
        {!isLoading && !error && tutorados.length > 0 && (
          <ul
            aria-label="Lista de tutorados"
            className="flex flex-col gap-3"
          >
            {tutorados.map(tutorado => (
              <li key={tutorado.matricula}>
                <TutoradoListItem
                  tutorado={tutorado}
                  onEdit={() => openEditPanel(tutorado)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Panel lateral / Modal del formulario */}
      {activePanel !== 'none' && (
        <ModalWrapper
          title={activePanel === 'create' ? 'Agregar tutorado' : 'Editar acceso'}
          onClose={handleClose}
        >
          <TutoradoForm
            mode={activePanel}
            matriculaFija={selectedTutorado?.matricula}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={handleFormSubmit}
            onCancel={handleClose}
          />
        </ModalWrapper>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

function TutoradoListItem({
  tutorado,
  onEdit,
}: {
  tutorado: TutoradoItem;
  onEdit: () => void;
}) {
  const initials = tutorado.nombre
    ? tutorado.nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : tutorado.matricula.slice(-2);

  return (
    <article
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
      aria-label={`Tutorado ${tutorado.nombre ?? tutorado.matricula}`}
    >
      {/* Avatar */}
      <div
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
        style={{ backgroundColor: tutorado.cuentaActiva ? '#3A7BC8' : '#94A3B8' }}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Datos */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {tutorado.nombre ?? `Estudiante ${tutorado.matricula}`}
        </p>
        <p className="text-xs text-gray-400">Matrícula: {tutorado.matricula}</p>
        {tutorado.carrera && (
          <p className="text-xs text-gray-400 truncate">{tutorado.carrera}</p>
        )}
      </div>

      {/* Estado de cuenta */}
      <span
        className={`
          shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          ${tutorado.cuentaActiva
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-gray-50 text-gray-500 border border-gray-200'
          }
        `}
        role="status"
        aria-label={`Cuenta ${tutorado.cuentaActiva ? 'activa' : 'inactiva'}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: tutorado.cuentaActiva ? '#2FA36B' : '#94A3B8' }}
          aria-hidden="true"
        />
        {tutorado.cuentaActiva ? 'Activa' : 'Inactiva'}
      </span>

      {/* Botón de edición */}
      <button
        onClick={onEdit}
        className="
          shrink-0 p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
          min-w-[44px] min-h-[44px] flex items-center justify-center
        "
        aria-label={`Editar acceso de ${tutorado.nombre ?? tutorado.matricula}`}
        title="Cambiar contraseña"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </article>
  );
}

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
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
      </div>
    </div>
  );
}
