/**
 * @module UserModal
 * @epic EPICA-6 Panel Ejecutivo y Administración
 * @hu HU002, HU023
 * @ux UX-ADM-01 (Gestión de Usuarios)
 * @api POST /api/users · PATCH /api/users/:id
 * @privacy Solo accesible para administradores y tutores autenticados. Las contraseñas están ocultas en tránsito.
 */

import React, { useState, useEffect } from 'react';
import { CreateUserDto, User, UserRole, userService } from '@/src/services/api/users';
import { getAdminCarreras } from '@/src/services/api/admin';
import { Carrera } from '@/src/types/admin';
import { useSession } from 'next-auth/react';
import { ROLE_ALIAS_MAP } from '@/src/lib/rbac.config';
import { FiX, FiSave, FiUser, FiMail, FiLock, FiShield, FiHash, FiAlertCircle } from 'react-icons/fi';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserDto & { carreraId?: string; tutorId?: string }) => Promise<void>;
  user?: User | null;
  isSaving: boolean;
  lockRole?: UserRole;
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'DOCENTE', label: 'Tutor Académico' },
  { value: 'MEDICO', label: 'Médico Institucional' },
  { value: 'PSICOLOGO', label: 'Psicólogo Educativo' },
  { value: 'ALUMNO', label: 'Estudiante / Alumno' },
];

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, isSaving, lockRole }) => {
  const { data: session } = useSession();
  const rawRole = session?.user?.role;
  const normalizedRole = rawRole ? ROLE_ALIAS_MAP[rawRole.toLowerCase()] : null;
  const isCurrentUserAdmin = normalizedRole === 'administrador';
  const isCurrentUserTutor = normalizedRole === 'tutor';
  const currentUserId = session?.user?.id;

  const [formData, setFormData] = useState<CreateUserDto>({
    nombre: '',
    email: '',
    password: '',
    role: lockRole || 'DOCENTE',
    matricula: '',
  });

  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [tutores, setTutores] = useState<User[]>([]);
  const [selectedCarreraId, setSelectedCarreraId] = useState('');
  const [selectedTutorId, setSelectedTutorId] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email || '',
        role: user.role,
        matricula: user.matricula || '',
        password: '', // Password empty when editing
      });
      setSelectedCarreraId((user as any).carreraId || '');
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        role: lockRole || 'DOCENTE',
        matricula: '',
      });
      setSelectedCarreraId('');
    }
  }, [user, isOpen, lockRole]);

  useEffect(() => {
    if (isOpen && (formData.role === 'ALUMNO' || formData.role === 'DOCENTE')) {
      getAdminCarreras()
        .then(data => {
          setCarreras(data);
          // Only auto-select first career if the user is not a tutor (tutors load it from their profile)
          // and we are not editing (or if editing and selectedCarreraId is empty)
          const hasSelectedCarrera = user && (user as any).carreraId;
          if (!hasSelectedCarrera && !isCurrentUserTutor && data.length > 0) {
            setSelectedCarreraId(data[0].id);
          }
        })
        .catch(err => console.error('Error fetching careers:', err));

      if (formData.role === 'ALUMNO' && !user) {
        if (isCurrentUserAdmin) {
          userService.getAll()
            .then(data => {
              const docenteUsers = data.filter(u => u.role === 'DOCENTE');
              setTutores(docenteUsers);
            })
            .catch(err => console.error('Error fetching tutors:', err));
        } else if (isCurrentUserTutor && currentUserId) {
          setSelectedTutorId(currentUserId);
          // Fetch tutor's profile to retrieve their carreraId
          userService.getById(currentUserId)
            .then((tutorProfile: any) => {
              if (tutorProfile?.carreraId) {
                setSelectedCarreraId(tutorProfile.carreraId);
              }
            })
            .catch(err => console.error('Error fetching tutor profile:', err));
        }
      }
    }
  }, [isOpen, formData.role, user, isCurrentUserAdmin, isCurrentUserTutor, currentUserId]);

  // Filter tutors by the selected career for Admin
  const filteredTutores = tutores.filter(t => (t as any).carreraId === selectedCarreraId);

  // Automatically update selectedTutorId to match the filtered list for Admins
  useEffect(() => {
    if (isCurrentUserAdmin && selectedCarreraId && tutores.length > 0) {
      if (filteredTutores.length > 0) {
        if (!filteredTutores.some(t => t.uid === selectedTutorId)) {
          setSelectedTutorId(filteredTutores[0].uid);
        }
      } else {
        setSelectedTutorId('');
      }
    }
  }, [selectedCarreraId, tutores, isCurrentUserAdmin, selectedTutorId, filteredTutores]);

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role,
      // Limpiar campos excluyentes al cambiar de rol para evitar payloads sucios
      email: role === 'ALUMNO' ? '' : prev.email,
      matricula: role === 'ALUMNO' ? prev.matricula : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...formData };
    if (formData.role === 'ALUMNO' && !user) {
      payload.carreraId = selectedCarreraId;
      payload.tutorId = isCurrentUserTutor ? currentUserId : selectedTutorId;
    } else if (formData.role === 'DOCENTE') {
      payload.carreraId = selectedCarreraId || null;
    }
    await onSave(payload);
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

            {/* Role selection (Hidden if locked) */}
            {!lockRole && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                  <FiShield size={12} />
                  ROL ASIGNADO
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-bold text-[var(--text-primary)]"
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Email (Hidden for students) */}
            {formData.role !== 'ALUMNO' && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                  <FiMail size={12} />
                  CORREO ELECTRÓNICO INSTITUCIONAL
                </label>
                <input
                  required={!user}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-medium"
                  placeholder="ejemplo@uptx.edu.mx"
                />
              </div>
            )}

            {/* Matricula (only if student) */}
            {formData.role === 'ALUMNO' && (
              <div className="space-y-1 animate-slide-up">
                <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                  <FiHash size={12} />
                  MATRÍCULA / ID ESTUDIANTIL
                </label>
                <input
                  required
                  type="text"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  className="w-full px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold"
                  placeholder="Ej. 20230001"
                />
              </div>
            )}

            {/* Carrera selector for Docente (Both creation and edit) */}
            {formData.role === 'DOCENTE' && (
              <div className="space-y-1 animate-slide-up">
                <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                  <FiShield size={12} />
                  CARRERA ASIGNADA AL TUTOR
                </label>
                <select
                  required
                  value={selectedCarreraId}
                  onChange={(e) => setSelectedCarreraId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-bold text-[var(--text-primary)]"
                >
                  <option value="">-- Seleccionar Carrera --</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Carrera & Tutor selectors (only for new students) */}
            {formData.role === 'ALUMNO' && !user && (
              <>
                <div className="space-y-1 animate-slide-up">
                  <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                    <FiShield size={12} />
                    CARRERA DEL ESTUDIANTE
                  </label>
                  <select
                    required
                    value={selectedCarreraId}
                    onChange={(e) => setSelectedCarreraId(e.target.value)}
                    disabled={isCurrentUserTutor}
                    className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-bold text-[var(--text-primary)] disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {carreras.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  {isCurrentUserTutor && (
                    <p className="text-[10px] text-[var(--text-muted)] italic">
                      * Estás registrando un alumno en tu carrera asignada.
                    </p>
                  )}
                </div>

                {isCurrentUserAdmin && (
                  <div className="space-y-1 animate-slide-up">
                    <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
                      <FiUser size={12} />
                      TUTOR ASIGNADO
                    </label>
                    {filteredTutores.length > 0 ? (
                      <select
                        required
                        value={selectedTutorId}
                        onChange={(e) => setSelectedTutorId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-bold text-[var(--text-primary)]"
                      >
                        {filteredTutores.map((t) => (
                          <option key={t.uid} value={t.uid}>{t.nombre}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center gap-2">
                        <FiAlertCircle className="text-amber-600 shrink-0" size={14} />
                        No hay tutores registrados en esta carrera. Primero registra o asigna un tutor a esta carrera.
                      </div>
                    )}
                  </div>
                )}
              </>
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
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none transition-all font-medium"
                placeholder={user ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
              />
              {!user && (
                <p className="text-[10px] text-[var(--text-muted)] italic">
                  * La contraseña debe tener al menos 6 caracteres.
                </p>
              )}
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
