/**
 * @module useLogin
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU001, HU002
 * @description Hook para orquestar el login, bloqueo y redirección basada en roles y consentimiento.
 */

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginDto, UserRole } from '../domain/types';
import { getDashboardByRole } from '../utils/redirection';

const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Cargar estado de bloqueo previo
  useEffect(() => {
    const lockoutUntil = localStorage.getItem('auth_lockout_until');
    if (lockoutUntil) {
      const remaining = Number(lockoutUntil) - Date.now();
      if (remaining > 0) {
        setIsBlocked(true);
        setTimeRemaining(remaining);
      } else {
        localStorage.removeItem('auth_lockout_until');
      }
    }
  }, []);

  // Sync del timer de bloqueo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1000) {
            setIsBlocked(false);
            localStorage.removeItem('auth_lockout_until');
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBlocked, timeRemaining]);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const handleLogin = async (data: LoginDto) => {
    if (isBlocked) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Intentar autenticación vía NextAuth
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        handleFailedAttempt(result.error);
      } else {
        // 2. Éxito: Recuperar sesión para evaluar rol y consentimiento
        const session = await getSession();
        
        if (!session || !session.user) {
          throw new Error("No se pudo recuperar la sesión activa");
        }

        const userRole = session.user.role as UserRole;
        const needsConsent = (session as any).needsConsent; // Flag del backend

        // 3. Lógica de Redirección (HU001 - Requerimiento de Privacidad)
        if (needsConsent) {
          router.push('/auth/consent');
        } else {
          // Si hay un callbackUrl válido (interno), lo usamos; si no, vamos al dashboard del rol
          const destination = (callbackUrl && callbackUrl.startsWith('/')) 
            ? callbackUrl 
            : getDashboardByRole(userRole);
            
          router.push(destination);
        }
        
        router.refresh();
      }
    } catch (err: any) {
      setError("Error de conexión institucional. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFailedAttempt = (serverError: string) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_TIME;
      localStorage.setItem('auth_lockout_until', lockoutUntil.toString());
      setIsBlocked(true);
      setTimeRemaining(LOCKOUT_TIME);
      setError("Cuenta bloqueada temporalmente por seguridad (3 intentos fallidos).");
    } else {
      setError(`Credenciales no válidas. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`);
    }
  };

  return {
    handleLogin,
    loading,
    error,
    isBlocked,
    timeRemaining: Math.ceil(timeRemaining / 1000 / 60),
    attemptsRemaining: MAX_ATTEMPTS - attempts
  };
}
