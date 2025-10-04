import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: Cookies.get("token") || null,
      isAuthenticated: !!Cookies.get("token"),

      login: (token, user) => {
        Cookies.set("token", token, { expires: 7 });
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        Cookies.remove("token");
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setAuth: (token, user) => {
        Cookies.set("token", token, { expires: 7 });
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        Cookies.remove("token");
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
