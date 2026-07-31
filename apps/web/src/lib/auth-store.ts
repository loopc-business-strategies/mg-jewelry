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

function clearSession() {
  localStorage.removeItem("mg_token");
  localStorage.removeItem("mg_user");
}

function readStoredUser(): User | null {
  const raw = localStorage.getItem("mg_user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as User;
    if (!user || typeof user !== "object" || !user.role) {
      clearSession();
      return null;
    }
    return user;
  } catch {
    clearSession();
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrate: () => {
    const user = readStoredUser();
    const token = user ? localStorage.getItem("mg_token") : null;
    if (!user || !token) {
      clearSession();
      set({ token: null, user: null });
      return;
    }
    set({ token, user });
  },
  setAuth: (token, user) => {
    localStorage.setItem("mg_token", token);
    localStorage.setItem("mg_user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    clearSession();
    set({ token: null, user: null });
  },
}));
