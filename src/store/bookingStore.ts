import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types/index';

interface BookingStore {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getBookingById: (id: string) => Booking | undefined;
  getActiveBookings: () => Booking[];
  clearBookings: () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],
      
      addBooking: (booking) => set((state) => {
        if (state.bookings.some(b => b.id === booking.id)) return state;
        return { bookings: [booking, ...state.bookings] };
      }),
      
      updateBookingStatus: (id, status) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
      })),
      
      getBookingById: (id) => {
        return get().bookings.find(b => b.id === id);
      },
      
      getActiveBookings: () => {
        return get().bookings.filter(b => !['completed', 'cancelled', 'disputed'].includes(b.status));
      },

      clearBookings: () => set({ bookings: [] })
    }),
    {
      name: 'ustaad360-bookings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
