import { create } from "zustand";

interface Credential {
  id: string;
  title: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
}

interface CredentialsState {
  credentials: Credential[];
  isLoading: boolean;
  setCredentials: (credentials: Credential[]) => void;
  addCredential: (credential: Credential) => void;
  updateCredential: (id: string, credential: Partial<Credential>) => void;
  deleteCredential: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useCredentialsStore = create<CredentialsState>((set) => ({
  credentials: [],
  isLoading: false,

  setCredentials: (credentials) => set({ credentials }),

  addCredential: (credential) =>
    set((state) => ({
      credentials: [...state.credentials, credential],
    })),

  updateCredential: (id, updatedCredential) =>
    set((state) => ({
      credentials: state.credentials.map((cred) =>
        cred.id === id ? { ...cred, ...updatedCredential } : cred,
      ),
    })),

  deleteCredential: (id) =>
    set((state) => ({
      credentials: state.credentials.filter((cred) => cred.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));
