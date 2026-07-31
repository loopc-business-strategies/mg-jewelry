"use client";

import { create } from "zustand";

type User = { id: string; name: string; email?: string; role: string };

type AuthState = {
  token: string | null;
  user: User | null;
  hydrate: () => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrate: () => {
    const token = localStorage.getItem("mg_token");
    const raw = localStorage.getItem("mg_user");
    set({
      token,
      user: raw ? (JSON.parse(raw) as User) : null,
    });
  },
  setAuth: (token, user) => {
    localStorage.setItem("mg_token", token);
    localStorage.setItem("mg_user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("mg_token");
    localStorage.removeItem("mg_user");
    set({ token: null, user: null });
  },
}));
