import { create } from 'zustand';

interface AuthState {
  user: { name: string; phone: string; city: string } | null;
  isGuest: boolean;
  login: (name: string, phone: string, city: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isGuest: false,
  login: (name, phone, city) => set({ user: { name, phone, city }, isGuest: false }),
  continueAsGuest: () => set({ user: null, isGuest: true }),
  logout: () => set({ user: null, isGuest: false }),
}));
