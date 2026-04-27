/**
 * @module TutoradoTypes
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU007
 * @ux UXDT-16, UXDT-17 (gestión de cuentas de tutorados)
 * @qa QA-01 (contraseñas nunca expuestas en estado global ni logs)
 * @api POST /tutor/tutorados · PUT /tutor/tutorados/:matricula · GET /tutor/tutorados
 * @privacy ⚠️ Las contraseñas NO se almacenan en estado global.
 *          Se limpian del estado local al desmontar el formulario.
 *          NUNCA loggear TutoradoFormState completo en consola.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Contratos de API (HU007)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Payload para crear una cuenta de tutorado.
 * Endpoint: POST /tutor/tutorados
 * @privacy password: NUNCA persistir en estado global ni loggear
 */
export interface CreateTutoradoRequest {
  matricula: string;    // Ej. "20230001"
  password: string;     // ⚠️ Solo en tránsito — limpiar tras submit
}

/**
 * Payload para actualizar la contraseña de un tutorado existente.
 * Endpoint: PUT /tutor/tutorados/:matricula
 * @privacy password: NUNCA persistir en estado global ni loggear
 */
export interface UpdateTutoradoRequest {
  password: string;     // Obligatorio — razón principal de la edición
}

/** Representación de un tutorado en el listado del Tutor */
export interface TutoradoItem {
  matricula: string;
  nombre?: string;        // Puede no estar disponible según backend
  carrera?: string;
  semestre?: number;
  cuentaActiva: boolean;
  creadoAt: string;       // ISO timestamp
}

/** Modo del formulario de gestión */
export type TutoradoFormMode = 'create' | 'edit';

// ─────────────────────────────────────────────────────────────────────────────
// Estado interno del formulario (NO se envía al backend en su totalidad)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Estado interno del formulario de tutorado.
 * @privacy ⚠️ Este objeto NUNCA debe loggear con console.log completo.
 *          Limpiar en useEffect cleanup al desmontar el componente.
 *          `confirmPassword` es solo validación cliente — NO se envía al backend.
 */
export interface TutoradoFormState {
  matricula: string;
  password: string;           // ⚠️ Limpiar al desmontar
  confirmPassword: string;    // Solo validación cliente — NO va al backend
}

/** Errores de validación del formulario */
export interface TutoradoFormErrors {
  matricula?: string;
  password?: string;
  confirmPassword?: string;
}
