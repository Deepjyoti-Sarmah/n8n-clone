import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await authAPI.signIn(
        credentials.email,
        credentials.password,
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.token && data.user) {
        //TODO: add setAuth
        setAuth(data.token, data.user);
        navigate("/dashboard");
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await authAPI.signUp(
        credentials.email,
        credentials.password,
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.token && data.User) {
        setAuth(data.token, data.User);
        navigate("/dashboard");
      }
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
    },
  });
}

export function useVerifyAuth() {
  const { setAuth, clearAuth } = useAuthStore();

  return useQuery({
    queryKey: ["auth-verify"],
    queryFn: async () => {
      const data = await authAPI.verify();
      return data;
    },
    retry: false,
    enabled: false, // Only run when explicitly called
    onSuccess: (data) => {
      if (data.user) {
        setAuth(data.token, data.user);
      }
    },
    onError: () => {
      clearAuth();
    },
  });
}
