import { api } from "@/services/api";
import { LoginDto, RegisterDto, ForgotPasswordDto } from "../../types";

export const authService = {
  login: async (data: LoginDto) => {
    const response = await api.post("/auth/login", data);
    return response.data;
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
