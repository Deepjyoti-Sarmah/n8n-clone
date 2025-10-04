import axios, { AxiosError } from "axios";

import { useAuthStore } from "@/store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  signUp: async (email: string, password: string) => {
    const response = await api.post("/user/signup", {
      email,
      password,
    });
    return response.data;
  },

  signIn: async (email: string, password: string) => {
    const response = await api.post("/user/signin", {
      email,
      password,
    });
    return response.data;
  },

  verify: async () => {
    const response = await api.get("/user/verify");
    return response.data;
  },
};

export const credentialsAPI = {
  getAll: async () => {
    const response = await api.get("/credentials/get");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/credentials/get/${id}`);
    return response.data;
  },

  create: async (credential: any) => {
    const response = await api.post("/credentials/post", credential);
    return response.data;
  },

  update: async (id: string, credential: any) => {
    const response = await api.put(`/credentials/update/${id}`, credential);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/credentials/delete/${id}`);
    return response.data;
  },
};

export const workflowsAPI = {
  getAll: async () => {
    const response = await api.get("/workflows/get");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/workflows/get/${id}`);
    return response.data;
  },

  create: async (workflow: any) => {
    const response = await api.post("/workflows/post", workflow);
    return response.data;
  },

  update: async (id: string, workflow: any) => {
    const response = await api.put(`/workflows/update/${id}`, workflow);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/workflows/delete/${id}`);
    return response.data;
  },

  triggerManual: async (id: string, payload: any = {}) => {
    const response = await api.post(`/workflows/manual/${id}`, payload);
    return response.data;
  },
};

export const executionAPI = {
  getExecutions: async (workflowId: string) => {
    const response = await api.get(`/workflows/${workflowId}/executions`);
    return response.data;
  },

  getExecutionById: async (executionId: string) => {
    const response = await api.get(`/executions/${executionId}`);
    return response.data;
  },
};

export default api;
