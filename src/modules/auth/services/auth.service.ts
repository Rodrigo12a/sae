import { api } from "@/src/lib/api";
import { LoginDto, RegisterDto, ForgotPasswordDto } from "../types";
import { AxiosError } from "axios";

export const authService = {
  login: async (data: LoginDto) => {
    try {
      const response = await api.post("/auth/login", data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ??
        (axiosError.response?.status === 401
          ? "Correo o contraseña incorrectos"
          : "Error al iniciar sesión");
      throw new Error(message);
    }
  },

  register: async (data: RegisterDto) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDto) => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },
};