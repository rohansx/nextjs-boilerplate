"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth.store";
import type { AuthResponse, LoginCredentials, SignupData } from "@/types";

/**
 * Login mutation hook
 * Uses TanStack Query for server state management
 * Updates Zustand store on success
 */
export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<AuthResponse>("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

/**
 * Signup mutation hook
 * Uses TanStack Query for server state management
 * Updates Zustand store on success
 */
export function useSignup() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (signupData: SignupData) => {
      const { data } = await api.post<AuthResponse>("/auth/signup", signupData);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

/**
 * Logout mutation hook
 * Clears auth state and invalidates queries
 */
export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      // Even if API call fails, clear local state
      logout();
      queryClient.clear();
    },
  });
}
