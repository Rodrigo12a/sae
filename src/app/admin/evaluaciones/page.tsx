/**
 * @page AdminEvaluacionesPage
 * @epic EPICA-3 Módulo de Administración
 * @hu HU016 Supervisión centralizada de evaluaciones
 * @description Panel administrativo para ver, buscar y filtrar todas las evaluaciones de la institución.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { surveyService } from '@/src/features/student-survey/services/survey.service';
import { EvaluationItem } from '@/src/types/questionnaire';
import { toast } from 'sonner';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiCalendar, 
  FiUser, 
  FiBook, 
  FiInfo, 
  FiActivity, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle
} from 'react-icons/fi';
import { Semaforo } from '@/src/components/ui/Semaforo';
import { motion } from 'framer-motion';

export default function AdminEvaluacionesPage() {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<EvaluationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros
  const [search, setSearch] = useState('');
  const [semaforoFilter, setSemaforoFilter] = useState('todos');
  const [carreraFilter, setCarreraFilter] = useState('todos');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await surveyService.getTodasEvaluaciones();
        setEvaluations(data);
        setFilteredEvaluations(data);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        toast.error(err.message || "Error al obtener las evaluaciones de la institución.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = evaluations;

    // Buscar
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(item => 
        item.nombre?.toLowerCase().includes(q) || 
        item.matricula?.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }

    // Filtro semáforo
    if (semaforoFilter !== 'todos') {
      result = result.filter(item => item.resultado?.semaforo === semaforoFilter);
    }

    // Filtro de "carrera" (En este mock de evaluaciones asumimos mapeo o simplemente listamos todos)
    setFilteredEvaluations(result);
  }, [search, semaforoFilter, carreraFilter, evaluations]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleExport = () => {
    toast.success("Se ha programado la descarga del reporte consolidado de evaluaciones.");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Monitoreo de Cuestionarios</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Supervisión institucional centralizada de todos los cuestionarios resueltos.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-3.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black active:scale-95 transition-all shadow-md flex items-center gap-2"
        >
          Exportar Reporte <FiDownload />
        </button>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Encuestas', count: evaluations.length, color: 'bg-blue-50 text-blue-700 border-blue-100', icon: <FiActivity /> },
          { label: 'Riesgo Crítico', count: evaluations.filter(e => e.resultado?.semaforo === 'rojo').length, color: 'bg-red-50 text-red-700 border-red-100', icon: <FiAlertTriangle /> },
          { label: 'Riesgo Moderado', count: evaluations.filter(e => e.resultado?.semaforo === 'amarillo').length, color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <FiInfo /> },
          { label: 'Sin Alerta', count: evaluations.filter(e => e.resultado?.semaforo === 'verde').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <FiCheckCircle /> },
        ].map((card, i) => (
          <div key={i} className={`p-6 bg-white rounded-3xl border ${card.color} shadow-sm flex items-center justify-between`}>
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-wider opacity-60">{card.label}</p>
              <p className="text-3xl font-black">{card.count}</p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl shadow-sm text-lg">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por alumno, matrícula o folio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-semibold"
          />
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <FiFilter className="text-slate-400 shrink-0" />
            <select
              value={semaforoFilter}
              onChange={(e) => setSemaforoFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white text-xs font-black uppercase tracking-wider"
            >
              <option value="todos">Todos los Semáforos</option>
              <option value="rojo">🔴 Rojo (Urgente)</option>
              <option value="amarillo">🟡 Amarillo (Seguimiento)</option>
              <option value="revisar">🟣 Monitoreo</option>
              <option value="verde">🟢 Estable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      {isLoading ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 h-80 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        </div>
      ) : filteredEvaluations.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-16 text-center text-slate-400">
          No se encontraron encuestas con los filtros aplicados.
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-5">Folio / Fecha</th>
                  <th className="px-6 py-5">Estudiante</th>
                  <th className="px-6 py-5">Estado</th>
                  <th className="px-6 py-5 text-right">Semáforo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEvaluations.map((item, idx) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900">
                        #{item.id.slice(0, 10).toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-1">
                        <FiCalendar /> {formatDate(item.fecha)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <FiUser className="text-slate-400" /> {item.nombre || 'Anonimizado'}
                      </div>
                      <div className="text-xs text-slate-400 font-bold mt-0.5">
                        Matrícula: {item.matricula || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {item.estado === 'pendiente' && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                          <FiClock className="animate-spin" /> Pendiente
                        </span>
                      )}
                      {item.estado === 'error_ml' && (
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-100 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                          <FiAlertTriangle /> Sin ML
                        </span>
                      )}
                      {item.estado === 'procesado' && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                          <FiCheckCircle /> Procesado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {item.resultado && (
                        <div className="flex justify-end items-center gap-3">
                          {item.resultado.riesgo_pct !== undefined && (
                            <span className="font-black text-slate-800 text-base">{item.resultado.riesgo_pct}%</span>
                          )}
                          <Semaforo
                            estado={item.resultado.semaforo}
                            etiqueta={item.resultado.diagnostico || 'Completado'}
                            dimension="Riesgo"
                            size="sm"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
