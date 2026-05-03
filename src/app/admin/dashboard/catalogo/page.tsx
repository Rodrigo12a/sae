/**
 * @page CatalogoAlertasPage
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU016, HU-ADMIN-CARRERAS
 * @ux UXDT-01
 * @qa QA-05 (latencia p95 < 1.5 s)
 * @api GET /api/carreras, GET /api/alert-catalog
 * @privacy Solo accesible para administradores
 */
'use client';

import React, { useState } from 'react';
import { FiClipboard, FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiX, FiCheck, FiInfo } from 'react-icons/fi';
import { useCarreras } from '@/src/features/dashboard-admin/hooks/useCarreras';
import { useAlertCatalog } from '@/src/features/dashboard-admin/hooks/useAlertCatalog';
import { Carrera, AlertCatalogItem, CreateCarreraDto, CreateAlertCatalogDto } from '@/src/types/admin';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function CatalogoAlertasPage() {
  const [activeTab, setActiveTab] = useState<'alertas' | 'carreras'>('alertas');
  
  // React Query Hooks
  const { 
    carreras, 
    isLoading: loadingCarreras, 
    createCarrera, 
    updateCarrera, 
    deleteCarrera 
  } = useCarreras();
  
  const { 
    alertas, 
    isLoading: loadingAlertas, 
    createAlerta, 
    updateAlerta, 
    deleteAlerta 
  } = useAlertCatalog();

  const isLoading = activeTab === 'carreras' ? loadingCarreras : loadingAlertas;
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAddClick = () => {
    setModalMode('create');
    setEditingId(null);
    if (activeTab === 'carreras') {
      setFormData({ nombre: '', activo: true });
    } else {
      setFormData({ etiqueta: '', nivel: 'amarillo', descripcion: '', activo: true });
    }
    setIsModalOpen(true);
  };

  const handleEditClick = (type: 'carrera' | 'alerta', item: any) => {
    setModalMode('edit');
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (type: 'carrera' | 'alerta', id: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar esta ${type === 'carrera' ? 'carrera' : 'etiqueta'}? Esta acción no se puede deshacer.`)) return;

    try {
      if (type === 'carrera') await deleteCarrera(id);
      else await deleteAlerta(id);
    } catch (error) {
      // Error handled by hook toast
    }
  };

  const handleToggleCarrera = async (carrera: Carrera) => {
    try {
      // Usar solo el campo necesario para la actualización parcial
      await updateCarrera({ 
        id: carrera.id, 
        data: { activo: !carrera.activo } 
      });
    } catch (error) {
      // Error handled by hook toast
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === 'carreras') {
        // Filtrar solo los campos permitidos por el DTO
        const carreraData: CreateCarreraDto = {
          nombre: formData.nombre,
          activo: formData.activo,
          materias: typeof formData.materias === 'string' 
            ? formData.materias.split(',').map((m: string) => m.trim()).filter((m: string) => m !== '')
            : formData.materias
        };
        
        if (modalMode === 'create') {
          await createCarrera(carreraData);
        } else {
          await updateCarrera({ id: editingId!, data: carreraData });
        }
      } else {
        // Filtrar solo los campos permitidos por el DTO de Alertas
        const alertaData: CreateAlertCatalogDto = {
          etiqueta: formData.etiqueta,
          nivel: formData.nivel,
          descripcion: formData.descripcion,
          activo: formData.activo
        };

        if (modalMode === 'create') {
          await createAlerta(alertaData);
        } else {
          await updateAlerta({ id: editingId!, data: alertaData });
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      // Error handled by hook toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto relative px-4 py-6">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiClipboard />
          <span>Gestión de sistema</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Catálogo Maestro</h1>
            <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
              Configuración de carreras, etiquetas operativas y reglas de negocio.
            </p>
          </div>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <FiPlus /> {activeTab === 'alertas' ? 'Nueva Etiqueta' : 'Nueva Carrera'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('alertas')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'alertas' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Etiquetas de Alertas
        </button>
        <button 
          onClick={() => setActiveTab('carreras')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'carreras' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Carreras y Programas
        </button>
      </div>

      {/* Content Table */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="bg-white border border-[var(--border-subtle)] rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden"
      >
        {isLoading ? (
          <div className="p-24 flex flex-col items-center justify-center text-gray-400 gap-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm font-bold tracking-widest uppercase">Sincronizando catálogo...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                    {activeTab === 'alertas' ? 'Etiqueta Operativa' : 'Nombre del Programa'}
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                    {activeTab === 'alertas' ? 'Nivel / Semáforo' : 'Estatus'}
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                    {activeTab === 'alertas' ? 'Estatus' : 'Acciones'}
                  </th>
                  {activeTab === 'alertas' && (
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeTab === 'alertas' ? (
                  alertas.length > 0 ? (
                    alertas.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50/30 transition-colors group">
                        {/* ... existing content ... */}
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-base">{a.etiqueta}</span>
                            <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{a.descripcion}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            a.nivel === 'rojo' ? 'bg-red-50 text-red-600 border-red-100' : 
                            a.nivel === 'amarillo' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                            a.nivel === 'verde' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            a.nivel === 'revisar' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              a.nivel === 'rojo' ? 'bg-red-500' : 
                              a.nivel === 'amarillo' ? 'bg-amber-500' : 
                              a.nivel === 'verde' ? 'bg-emerald-500' :
                              a.nivel === 'revisar' ? 'bg-purple-500' :
                              'bg-slate-400'
                            }`} />
                            {a.nivel}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-black border border-green-100 uppercase tracking-tighter">
                            <FiCheck size={14} /> Activo
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick('alerta', a)} 
                              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              title="Editar Alerta"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick('alerta', a.id)}
                              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Eliminar Alerta"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                          <FiAlertCircle size={48} />
                          <p className="text-sm font-bold uppercase tracking-widest">No hay etiquetas registradas</p>
                        </div>
                      </td>
                    </tr>
                  )
                ) : (
                  carreras.length > 0 ? (
                    carreras.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <span className="font-bold text-slate-800 text-base">{c.nombre}</span>
                        </td>
                        <td className="px-8 py-5">
                          <button 
                            onClick={() => handleToggleCarrera(c)}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest transition-all ${
                              c.activo 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${c.activo ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            {c.activo ? 'Activa' : 'Inactiva'}
                          </button>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick('carrera', c)} 
                              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              title="Editar Carrera"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick('carrera', c.id)}
                              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Eliminar Carrera"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-40">
                          <FiAlertCircle size={48} />
                          <p className="text-sm font-bold uppercase tracking-widest">No hay carreras registradas</p>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-8 flex gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <FiInfo size={28} />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 text-lg">Control de Programas</h3>
            <p className="text-sm text-indigo-700/80 mt-1 leading-relaxed">
              Las carreras gestionadas aquí se reflejan inmediatamente en la carga de estudiantes y los dashboards ejecutivos. 
              Desactivar una carrera ocultará sus KPIs sin borrar los datos históricos.
            </p>
          </div>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-[2rem] p-8 flex gap-5">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
            <FiAlertCircle size={28} />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-lg">Jerarquía de Alertas</h3>
            <p className="text-sm text-amber-700/80 mt-1 leading-relaxed">
              La prioridad de atención (Semáforo) determina el orden de aparición en los widgets de alertas de los Tutores. 
              Cualquier cambio aquí afecta la lógica de priorización del Motor de IA.
            </p>
          </div>
        </div>
      </div>

      {/* Universal CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {modalMode === 'create' ? 'Agregar' : 'Editar'} {activeTab === 'carreras' ? 'Carrera' : 'Etiqueta'}
                  </h2>
                  <p className="text-slate-400 font-medium mt-1">Completa los campos para actualizar el catálogo institucional.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                  <FiX size={32} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {activeTab === 'carreras' ? (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre Oficial del Programa</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Ingeniería en Inteligencia Artificial"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-bold text-slate-700"
                        value={formData.nombre || ''}
                        onChange={e => setFormData((prev: any) => ({ ...prev, nombre: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Estatus Inicial</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                        value={formData.activo ? 'true' : 'false'}
                        onChange={e => setFormData((prev: any) => ({ ...prev, activo: e.target.value === 'true' }))}
                      >
                        <option value="true">Activa y Visible</option>
                        <option value="false">Inactiva (Oculta)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Materias (separadas por coma)</label>
                      <textarea 
                        rows={3}
                        placeholder="Ej. Cálculo I, Programación, Física..."
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-600"
                        value={Array.isArray(formData.materias) ? formData.materias.join(', ') : formData.materias || ''}
                        onChange={e => setFormData((prev: any) => ({ ...prev, materias: e.target.value }))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre de la Etiqueta</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Riesgo Académico Leve"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                        value={formData.etiqueta || ''}
                        onChange={e => setFormData((prev: any) => ({ ...prev, etiqueta: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nivel de Gravedad (Semáforo)</label>
                      <div className="grid grid-cols-5 gap-2">
                        {['rojo', 'amarillo', 'verde', 'revisar', 'gris'].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setFormData((prev: any) => ({ ...prev, nivel: n }))}
                            className={`py-3 rounded-xl border-2 text-[8px] font-black uppercase tracking-widest transition-all ${
                              formData.nivel === n 
                                ? n === 'rojo' ? 'bg-red-50 border-red-500 text-red-600' :
                                  n === 'amarillo' ? 'bg-amber-50 border-amber-500 text-amber-600' : 
                                  n === 'verde' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' :
                                  n === 'revisar' ? 'bg-purple-50 border-purple-500 text-purple-600' :
                                  'bg-slate-50 border-slate-500 text-slate-600'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Descripción de Apoyo</label>
                      <textarea 
                        rows={3}
                        placeholder="Instrucciones para el tutor al ver esta etiqueta..."
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-600"
                        value={formData.descripcion || ''}
                        onChange={e => setFormData((prev: any) => ({ ...prev, descripcion: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-slate-400 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Sincronizando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
