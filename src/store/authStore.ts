import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ustaad360_user';

export interface UserProfile {
  name: string;
  phone: string;
  city: string;
  preferredLanguage: 'english' | 'urdu' | 'roman_urdu';
  totalBookings: number;
  loyaltyDiscount: boolean;
  joinedAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isGuest: boolean;
  isHydrated: boolean;
  login: (profile: UserProfile) => Promise<void>;
  signup: (profile: UserProfile) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  incrementBookings: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isGuest: false,
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { user: UserProfile | null; isGuest: boolean };
        set({ user: saved.user, isGuest: saved.isGuest, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  login: async (profile) => {
    set({ user: profile, isGuest: false });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: profile, isGuest: false }));
    } catch {}
  },

  signup: async (profile) => {
    const newProfile: UserProfile = { ...profile, totalBookings: 0, loyaltyDiscount: false, joinedAt: new Date().toISOString() };
    set({ user: newProfile, isGuest: false });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newProfile, isGuest: false }));
    } catch {}
  },

  continueAsGuest: () => {
    set({ user: null, isGuest: true });
  },

  logout: async () => {
    set({ user: null, isGuest: false });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
  },

  incrementBookings: async () => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, totalBookings: user.totalBookings + 1, loyaltyDiscount: user.totalBookings + 1 >= 3 };
    set({ user: updated });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updated, isGuest: false }));
    } catch {}
  },
}));
