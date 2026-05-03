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
import { UserModal } from '@/src/features/dashboard-admin/components/UserManagement/UserModal';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import type { User, CreateUserDto } from '@/src/services/api/users';
import { toast } from 'sonner';
import { FiTrash2, FiEdit2, FiUserPlus } from 'react-icons/fi';
import { useTutorados } from '@/src/features/dashboard-tutor/hooks/useTutorados';

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
    handleDelete,
  } = useTutorados();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CreateUserDto) => {
    let success = false;
    if (selectedUser) {
      success = await handleUpdate(selectedUser.id, data);
      if (success) toast.success('Estudiante actualizado correctamente');
    } else {
      success = await handleCreate(data);
      if (success) toast.success('Estudiante registrado correctamente');
    }
    if (success) setIsModalOpen(false);
  };

  const confirmDelete = async (user: User) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${user.nombre}? Esta acción no se puede deshacer.`)) {
      const success = await handleDelete(user.id);
      if (success) toast.success('Estudiante eliminado correctamente');
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
            onClick={openCreateModal}
            className="
              flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all shadow-sm hover:shadow-md shrink-0
            "
          >
            <FiUserPlus size={18} />
            Agregar estudiante
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
          <div role="status" className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="text-4xl mb-4" aria-hidden="true">👥</span>
            <p className="text-lg font-bold text-gray-700 mb-1">Sin tutorados registrados</p>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Comienza registrando a tus estudiantes para que puedan acceder al portal SAE.
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm"
            >
              Registrar primer estudiante
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
              <li key={tutorado.id}>
                <TutoradoListItem
                  tutorado={tutorado}
                  onEdit={() => openEditModal(tutorado)}
                  onDelete={() => confirmDelete(tutorado)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        user={selectedUser || undefined}
        isSaving={isSubmitting}
        lockRole="ALUMNO"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

function TutoradoListItem({
  tutorado,
  onEdit,
  onDelete,
}: {
  tutorado: User;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const initials = tutorado.nombre
    ? tutorado.nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : (tutorado.matricula?.slice(-2) || 'ST');

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
        <p className="text-sm font-bold text-gray-900 truncate">
          {tutorado.nombre}
        </p>
        <p className="text-xs text-gray-500 font-medium">Matrícula: {tutorado.matricula || 'N/A'}</p>
        <p className="text-[10px] text-gray-400 font-medium italic">Registrado el {new Date(tutorado.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Estado de cuenta */}
      <span
        className={`
          shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
          bg-green-50 text-green-700 border border-green-200
        `}
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-green-500"
        />
        Activa
      </span>

      {/* Acciones */}
      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          title="Editar datos"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
          title="Eliminar estudiante"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </article>
  );
}


