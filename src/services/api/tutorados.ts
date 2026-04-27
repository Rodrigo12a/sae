/**
 * @module TutoradosService
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU007
 * @api GET /tutor/tutorados · POST /tutor/tutorados · PUT /tutor/tutorados/:matricula
 * @privacy ⚠️ Este servicio maneja contraseñas en tránsito.
 *          NUNCA loggear los parámetros de estas funciones.
 *          Las contraseñas deben limpiarse del estado local tras el submit.
 */

import { api } from '@/src/lib/api';
import type {
  TutoradoItem,
  CreateTutoradoRequest,
  UpdateTutoradoRequest,
} from '@/src/types/tutorado';

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — remover cuando el backend esté disponible
// ─────────────────────────────────────────────────────────────────────────────

let MOCK_TUTORADOS: TutoradoItem[] = [
  {
    matricula: '20230001',
    nombre: 'Ana García López',
    carrera: 'Ingeniería en Sistemas',
    semestre: 4,
    cuentaActiva: true,
    creadoAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    matricula: '20230045',
    nombre: 'Carlos Mendoza Ruiz',
    carrera: 'Administración de Empresas',
    semestre: 3,
    cuentaActiva: true,
    creadoAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    matricula: '20220087',
    cuentaActiva: false, // Cuenta sin datos completos
    creadoAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HU007 — Listar tutorados del tutor autenticado
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene el listado de tutorados del tutor autenticado.
 */
export async function getTutorados(): Promise<TutoradoItem[]> {
  // TODO: conectar a GET /tutor/tutorados cuando esté verificado en Swagger
  // return api.get<TutoradoItem[]>('/tutor/tutorados').then(res => res.data);

  await new Promise(resolve => setTimeout(resolve, 500));
  return [...MOCK_TUTORADOS];
}

// ─────────────────────────────────────────────────────────────────────────────
// HU007 — Registrar nueva cuenta de tutorado
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea una cuenta de tutorado con matrícula y contraseña.
 * @privacy ⚠️ No loggear el parámetro `data` completo (contiene password)
 * @throws Error con message 'MATRICULA_DUPLICADA' si el backend devuelve 409
 */
export async function createTutorado(data: CreateTutoradoRequest): Promise<void> {
  // TODO: conectar a POST /tutor/tutorados cuando esté verificado en Swagger
  // try {
  //   await api.post('/tutor/tutorados', data);
  // } catch (error: unknown) {
  //   if (axios.isAxiosError(error) && error.response?.status === 409) {
  //     throw new Error('MATRICULA_DUPLICADA');
  //   }
  //   throw error;
  // }

  await new Promise(resolve => setTimeout(resolve, 800));

  // Simular error 409 si la matrícula ya existe en el mock
  const exists = MOCK_TUTORADOS.some(t => t.matricula === data.matricula);
  if (exists) throw new Error('MATRICULA_DUPLICADA');

  // Agregar al mock
  MOCK_TUTORADOS = [
    ...MOCK_TUTORADOS,
    {
      matricula: data.matricula,
      cuentaActiva: true,
      creadoAt: new Date().toISOString(),
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// HU007 — Actualizar contraseña de tutorado existente
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Actualiza la contraseña de un tutorado existente.
 * @privacy ⚠️ No loggear el parámetro `data` completo (contiene password)
 */
export async function updateTutorado(
  matricula: string,
  data: UpdateTutoradoRequest,
): Promise<void> {
  // TODO: conectar a PUT /tutor/tutorados/:matricula cuando esté verificado en Swagger
  // await api.put(`/tutor/tutorados/${matricula}`, data);

  await new Promise(resolve => setTimeout(resolve, 600));

  const exists = MOCK_TUTORADOS.some(t => t.matricula === matricula);
  if (!exists) throw new Error('TUTORADO_NO_ENCONTRADO');
  // En el mock, no hay nada que actualizar (no almacenamos contraseñas)
}
