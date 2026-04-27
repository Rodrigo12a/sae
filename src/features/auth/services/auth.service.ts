/**
 * @module AuthService
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU001
 * @description Capa de acceso a datos para autenticación.
 */

import { LoginDto, LoginResponse } from "../domain/types";

// Helper para obtener URL base
const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "https://sae-backend-beige.vercel.app";
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const authService = {
  /**
   * Realiza el inicio de sesión contra el backend institucional.
   * Usamos fetch nativo para evitar ciclos (NextAuth -> axios interceptor -> getSession -> NextAuth)
   */
  login: async (data: LoginDto): Promise<LoginResponse> => {
    try {
      // Detectar si el identificador es una matrícula (solo dígitos)
      const isMatricula = /^\d+$/.test(data.email);

      const payload = isMatricula
        ? { matricula: data.email, password: data.password }
        : { email: data.email, password: data.password };

      const response = await fetch(`${getBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Manejo de bloqueo de cuenta (403 o 429 según el backend)
        if (response.status === 403 && responseData?.lockoutExpiry) {
          return {
            success: false,
            error: "Cuenta bloqueada temporalmente por demasiados intentos.",
            lockoutExpiry: responseData.lockoutExpiry
          };
        }

        const message = responseData?.message || responseData?.error || "Error al conectar con el servidor institucional.";
        throw new Error(message);
      }

      // Mapeo de roles del backend a roles del frontend
      const roleMap: Record<string, any> = {
        'ADMIN': 'administrador',
        'ADMINISTRADOR': 'administrador',
        'TUTOR': 'tutor',
        'DOCENTE': 'tutor',
        'STUDENT': 'estudiante',
        'ESTUDIANTE': 'estudiante',
        'ALUMNO': 'estudiante',
        'PSYCHOLOGIST': 'psicologo',
        'PSICOLOGO': 'psicologo',
        'PSICÓLOGO': 'psicologo',
        'DOCTOR': 'medico',
        'MEDICO': 'medico',
        'MÉDICO': 'medico'
      };

      const rawRole = responseData.user?.role?.toUpperCase();
      const mappedRole = roleMap[rawRole] || responseData.user?.role || 'tutor';

      // Si la respuesta es exitosa (200 o 201), mapeamos al contrato interno
      return {
        success: true,
        session: {
          user: {
            id: responseData.user?.uid || responseData.user?.id,
            name: responseData.user?.nombre || responseData.user?.name,
            email: responseData.user?.email || data.email,
            role: mappedRole as any,
            institutionId: responseData.user?.institutionId || "DEFAULT",
          },
          token: responseData.access_token || responseData.token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          needsConsent: responseData.needsConsent || false,
        }
      };
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message === 'fetch failed') {
        throw new Error("Error de red al conectar con el servidor institucional.");
      }
      throw err;
    }
  },

  /**
   * Registra el consentimiento de privacidad del usuario.
   */
  submitConsent: async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${getBaseUrl()}/auth/consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, accepted: true, version: "1.0.0" }),
      });
      return response.ok;
    } catch (err) {
      console.error("Error submitting consent:", err);
      return false;
    }
  }
};
