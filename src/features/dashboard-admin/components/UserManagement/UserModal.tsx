import React, { useState, useEffect } from 'react';
import { CreateUserDto, User, UserRole } from '@/src/services/api/users';
import { FiX, FiSave, FiUser, FiMail, FiLock, FiShield, FiHash } from 'react-icons/fi';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserDto) => Promise<void>;
  user?: User | null;
  isSaving: boolean;
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'DOCENTE', label: 'Tutor Académico' },
  { value: 'MEDICO', label: 'Médico Institucional' },
  { value: 'PSICOLOGO', label: 'Psicólogo Educativo' },
  { value: 'ALUMNO', label: 'Estudiante / Alumno' },
];

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, isSaving }) => {
  const [formData, setFormData] = useState<CreateUserDto>({
    nombre: '',
    email: '',
    password: '',
    role: 'DOCENTE',
    matricula: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        matricula: user.matricula || '',
        password: '', // Password empty when editing
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        role: 'DOCENTE',
        matricula: '',
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-[var(--border-subtle)] animate-scale-in">
        {/* Header */}
        <div className="bg-[var(--bg-section)] px-6 py-4 flex justify-between items-center border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-xl font-black text-[var(--text-primary)]">
              {user ? 'Editar Usuario' : 'Crear Usuario'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {user ? 'Actualiza los permisos y datos del perfil.' : 'Registra un nuevo integrante al sistema.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-[var(--text-muted)]">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                <FiUser size={12} />
                NOMBRE COMPLETO
              </label>
              <input
                required
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-medium"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                <FiMail size={12} />
                CORREO ELECTRÓNICO
              </label>
              <input
                required={!user}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-medium"
                placeholder="ejemplo@sae.edu"
              />
            </div>

            {/* Role selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                <FiShield size={12} />
                ROL ASIGNADO
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-bold text-[var(--text-primary)]"
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Matricula (only if student) */}
            {formData.role === 'ALUMNO' && (
              <div className="space-y-1 animate-slide-up">
                <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                  <FiHash size={12} />
                  MATRÍCULA INSTITUCIONAL
                </label>
                <input
                  required
                  type="text"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  className="w-full px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold"
                  placeholder="ID del Estudiante"
                />
              </div>
            )}

            {/* Password (only if new or explicitly changed) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                <FiLock size={12} />
                {user ? 'NUEVA CONTRASEÑA (OPCIONAL)' : 'CONTRASEÑA'}
              </label>
              <input
                required={!user}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-medium"
                placeholder={user ? 'Dejar en blanco para no cambiar' : 'Mínimo 8 caracteres'}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-section)] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiSave size={16} />
                  {user ? 'Actualizar' : 'Crear Usuario'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
