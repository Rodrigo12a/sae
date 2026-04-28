/**
 * @page CatalogoAlertasPage
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU016 — Configuración del catálogo de alertas y carreras
 * @privacy Solo accesible para administradores
 */
'use client';

import React, { useState, useEffect } from 'react';
import { FiClipboard, FiPlus, FiEdit2, FiTrash2, FiBook, FiCheckCircle, FiAlertCircle, FiX, FiCheck, FiInfo } from 'react-icons/fi';
import { 
  getAdminCarreras, 
  getAlertCatalog, 
  createCarrera, 
  updateCarrera, 
  deleteCarrera,
  createAlertTag,
  updateAlertTag,
  deleteAlertTag
} from '@/src/services/api/admin';
import { toast } from 'sonner';

interface Carrera {
  id: string;
  nombre: string;
  codigo: string;
  activa: boolean;
}

interface AlertTag {
  id: string;
  etiqueta: string;
  nivel: 'rojo' | 'amarillo' | 'verde' | 'revisar' | string;
  descripcion: string;
}

export default function CatalogoAlertasPage() {
  const [activeTab, setActiveTab] = useState<'alertas' | 'carreras'>('alertas');
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [alertas, setAlertas] = useState<AlertTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Carrera & AlertTag>>({});
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [cData, aData] = await Promise.all([getAdminCarreras(), getAlertCatalog()]);
      setCarreras(cData);
      setAlertas(aData);
    } catch (error) {
      toast.error('Error al cargar datos del catálogo');
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddClick = () => {
    setModalMode('create');
    setEditingId(null);
    if (activeTab === 'carreras') {
      setFormData({ nombre: '', codigo: '', activa: true });
    } else {
      setFormData({ etiqueta: '', nivel: 'amarillo', descripcion: '' });
    }
    setIsModalOpen(true);
  };

  const handleEditClick = (type: 'carrera' | 'alerta', item: Carrera | AlertTag) => {
    setModalMode('edit');
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };


  const handleDeleteClick = async (type: 'carrera' | 'alerta', id: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar esta ${type}? Esta acción no se puede deshacer.`)) return;

    try {
      if (type === 'carrera') await deleteCarrera(id);
      else await deleteAlertTag(id);
      
      toast.success(`${type === 'carrera' ? 'Carrera' : 'Alerta'} eliminada`);
      loadData();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleToggleCarrera = async (carrera: Carrera) => {
    try {
      await updateCarrera(carrera.id, { ...carrera, activa: !carrera.activa });
      toast.success(`Carrera ${!carrera.activa ? 'activada' : 'desactivada'}`);
      loadData();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === 'carreras') {
        if (modalMode === 'create') await createCarrera(formData);
        else await updateCarrera(editingId!, formData);
      } else {
        if (modalMode === 'create') await createAlertTag(formData);
        else await updateAlertTag(editingId!, formData);
      }
      
      toast.success('Cambios guardados correctamente');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Error al guardar cambios');
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
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <FiPlus /> {activeTab === 'alertas' ? 'Nueva Etiqueta' : 'Nueva Carrera'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('alertas')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'alertas' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Etiquetas de Alertas
        </button>
        <button 
          onClick={() => setActiveTab('carreras')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'carreras' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Carreras y Programas
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white border border-[var(--border-subtle)] rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden">
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
                    {activeTab === 'alertas' ? 'Nivel / Semáforo' : 'Código Identificador'}
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                    Estatus
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeTab === 'alertas' ? (
                  alertas.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-base">{a.etiqueta}</span>
                          <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{a.descripcion}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          a.nivel === 'rojo' ? 'bg-red-50 text-red-600 border-red-100' : 
                          a.nivel === 'amarillo' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            a.nivel === 'rojo' ? 'bg-red-500' : 
                            a.nivel === 'amarillo' ? 'bg-amber-500' : 'bg-purple-500'
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
                  carreras.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-800 text-base">{c.nombre}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-mono text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                          {c.codigo}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <button 
                          onClick={() => handleToggleCarrera(c)}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest transition-all ${
                            c.activa 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                              : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${c.activa ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          {c.activa ? 'Activa' : 'Inactiva'}
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
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-scale-in">
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
                        onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Siglas / Código</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej. IIA"
                          className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-black text-indigo-600 uppercase"
                          value={formData.codigo || ''}
                          onChange={e => setFormData(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Estatus Inicial</label>
                        <select 
                          className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                          value={formData.activa ? 'true' : 'false'}
                          onChange={e => setFormData(prev => ({ ...prev, activa: e.target.value === 'true' }))}
                        >
                          <option value="true">Activa y Visible</option>
                          <option value="false">Inactiva (Oculta)</option>
                        </select>
                      </div>
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
                        onChange={e => setFormData(prev => ({ ...prev, etiqueta: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nivel de Gravedad (Semáforo)</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['verde', 'amarillo', 'rojo'].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, nivel: n }))}
                            className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                              formData.nivel === n 
                                ? n === 'rojo' ? 'bg-red-50 border-red-500 text-red-600' :
                                  n === 'amarillo' ? 'bg-amber-50 border-amber-500 text-amber-600' : 'bg-emerald-50 border-emerald-500 text-emerald-600'
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
                        onChange={e => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
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
          </div>
        </div>
      )}
    </div>
  );
}
