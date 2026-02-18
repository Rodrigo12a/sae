import { useState } from "react";
import { authService } from "../services/auth.service";
import { LoginDto, RegisterDto, ForgotPasswordDto } from "../../types"

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginDto) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.login(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.register(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Register failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordDto) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.forgotPassword(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, forgotPassword, loading, error };
}
