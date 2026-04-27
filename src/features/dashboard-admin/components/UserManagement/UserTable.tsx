import React from 'react';
import { User, UserRole } from '@/src/services/api/users';
import { FiEdit2, FiTrash2, FiUser, FiMail, FiShield, FiMoreVertical } from 'react-icons/fi';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const ROLE_LABELS: Record<UserRole, { label: string; color: string; bg: string }> = {
  ADMIN: { label: 'Administrador', color: 'text-purple-700', bg: 'bg-purple-50' },
  DOCENTE: { label: 'Tutor Académico', color: 'text-blue-700', bg: 'bg-blue-50' },
  MEDICO: { label: 'Médico', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  PSICOLOGO: { label: 'Psicólogo', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  ALUMNO: { label: 'Estudiante', color: 'text-amber-700', bg: 'bg-amber-50' },
};

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">
            <th className="px-6 py-3">Usuario</th>
            <th className="px-6 py-3">Rol / Nivel</th>
            <th className="px-6 py-3">ID / Matrícula</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const roleInfo = ROLE_LABELS[user.role] || { label: user.role, color: 'text-slate-700', bg: 'bg-slate-50' };
            
            return (
              <tr 
                key={user.id} 
                className="bg-white border border-[var(--border-subtle)] rounded-xl shadow-sm hover:shadow-md transition-all group"
              >
                <td className="px-6 py-4 rounded-l-xl border-y border-l border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${roleInfo.bg} flex items-center justify-center text-[var(--color-secondary)] font-bold text-sm`}>
                      {user.nombre.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-sm">{user.nombre}</div>
                      <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <FiMail size={10} />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-y border-[var(--border-subtle)]">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border ${roleInfo.color} ${roleInfo.bg} border-current/20`}>
                    <FiShield size={10} />
                    {roleInfo.label}
                  </span>
                </td>
                <td className="px-6 py-4 border-y border-[var(--border-subtle)]">
                  <span className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-section)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {user.matricula || user.id.substring(0, 8)}
                  </span>
                </td>
                <td className="px-6 py-4 rounded-r-xl border-y border-r border-[var(--border-subtle)] text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar usuario"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar usuario"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div className="group-hover:hidden text-[var(--text-muted)]">
                    <FiMoreVertical />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
