import axios, { AxiosError } from "axios";

import { useAuthStore } from "@/store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

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

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
}

export const authAPI = {
  signUp: async (email: string, password: string) => {
    const response = await api.post<APIResponse<{ token: string; user: any }>>(
      "/user/signup",
      {
        email,
        password,
      },
    );
    return response.data;
  },

  signIn: async (email: string, password: string) => {
    const response = await api.post<APIResponse<{ token: string; user: any }>>(
      "/user/signin",
      {
        email,
        password,
      },
    );
    return response.data;
  },
};

export const credentialsAPI = {
  getAll: async () => {
    const response =
      await api.get<APIResponse<{ credentials: any[] }>>("/credentials/get");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<APIResponse<{ credentials: any }>>(
      `/credentials/get/${id}`,
    );
    return response.data;
  },

  create: async (credential: any) => {
    const response = await api.post<APIResponse<{ credentials: any }>>(
      "/credentials/post",
      credential,
    );
    return response.data;
  },

  update: async (id: string, credential: any) => {
    const response = await api.put<APIResponse<{ credentials: any }>>(
      `/credentials/update/${id}`,
      credential,
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<APIResponse>(`/credentials/delete/${id}`);
    return response.data;
  },
};

export const workflowsAPI = {
  getAll: async () => {
    const response =
      await api.get<APIResponse<{ workflows: any[] }>>("/workflows/get");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<APIResponse<{ workflow: any }>>(
      `/workflows/get/${id}`,
    );
    return response.data;
  },

  create: async (workflow: any) => {
    const response = await api.post<APIResponse<{ workflow: any }>>(
      "/workflows/post",
      workflow,
    );
    return response.data;
  },

  update: async (id: string, workflow: any) => {
    const response = await api.put<APIResponse<{ workflow: any }>>(
      `/workflows/update/${id}`,
      workflow,
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<APIResponse>(`/workflows/delete/${id}`);
    return response.data;
  },

  triggerManual: async (id: string, payload: any = {}) => {
    const response = await api.post<APIResponse<{ executionId: string }>>(
      `/workflows/manual/${id}`,
      payload,
    );
    return response.data;
  },
};

export const executionAPI = {
  getExecutions: async (workflowId: string) => {
    const response = await api.get<APIResponse<{ executions: any[] }>>(
      `/workflows/${workflowId}/executions`,
    );
    return response.data;
  },

  getExecutionById: async (executionId: string) => {
    const response = await api.get<APIResponse<{ execution: any }>>(
      `/executions/${executionId}`,
    );
    return response.data;
  },
};
