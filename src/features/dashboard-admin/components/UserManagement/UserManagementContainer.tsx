/**
 * @module UserManagementContainer
 * @epic EPICA-6 Panel Ejecutivo y Administración
 * @hu HU002, HU023
 * @ux UX-ADM-01 (Gestión de Usuarios)
 * @api GET /api/users · POST /api/users · PATCH /api/users/:id · DELETE /api/users/:id
 */

import React, { useState, useEffect } from 'react';
import { User, userService, CreateUserDto, UserRole } from '@/src/services/api/users';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { FiUserPlus, FiSearch, FiFilter, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';

export const UserManagementContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await userService.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(u => 
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.matricula?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'ALL') {
      result = result.filter(u => u.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (uid: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await userService.delete(uid);
        toast.success('Usuario eliminado correctamente');
        loadUsers();
      } catch (error) {
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  const handleSave = async (data: CreateUserDto) => {
    setIsSaving(true);
    try {
      if (selectedUser) {
        await userService.update(selectedUser.uid, data);
        toast.success('Usuario actualizado correctamente');
      } else {
        await userService.create(data);
        toast.success('Usuario creado correctamente');
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      toast.error('Error al guardar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
        <div className="flex flex-1 gap-2 w-full max-w-xl">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-2.5 bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-primary)] outline-none"
          >
            <option value="ALL">Todos los roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="DOCENTE">Tutores</option>
            <option value="MEDICO">Médicos</option>
            <option value="PSICOLOGO">Psicólogos</option>
            <option value="ALUMNO">Estudiantes</option>
          </select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={loadUsers}
            className="p-3 bg-[var(--bg-section)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--border-subtle)] transition-colors"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-black hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-blue-900/10"
          >
            <FiUserPlus size={18} />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center text-center">
          <FiAlertCircle className="text-red-500 mb-3" size={32} />
          <h3 className="text-red-800 font-bold text-lg mb-1">Error al conectar con la gestión de usuarios</h3>
          <p className="text-red-600 text-sm max-w-md">No pudimos cargar la lista de usuarios. Por favor, verifica tu conexión o el estado del backend.</p>
          <button onClick={loadUsers} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors">
            Reintentar
          </button>
        </div>
      )}

      {/* Table */}
      {!isError && (
        <UserTable 
          users={filteredUsers} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          isLoading={isLoading} 
        />
      )}

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        user={selectedUser}
        isSaving={isSaving}
      />
    </div>
  );
};
