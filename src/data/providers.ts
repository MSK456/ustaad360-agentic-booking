import { Provider, TimeSlot } from '../types';

const slot = (date: string, start: string, end: string, booked = false): TimeSlot => ({
  date, startTime: start, endTime: end, isBooked: booked,
});

const today = '2026-05-19';
const tomorrow = '2026-05-20';

export const MOCK_PROVIDERS: Provider[] = [
  // ─── ISLAMABAD AC TECHNICIANS (5 types per request) ──────────────────────
  {
    id: 'isb_ac1', name: 'Zain AC Inspection', phone: '+92-300-1111111', city: 'Islamabad', area: 'G-13',
    location: { lat: 33.647, lng: 72.963 }, serviceCategories: ['ac_technician'],
    skills: ['inspection only', 'ac checking'],
    yearsExperience: 4, rating: 4.6, reviewCount: 45, reviewRecencyScore: 0.8,
    onTimeScore: 0.9, cancellationRate: 0.05, isAvailable: true,
    availableSlots: [slot(today, '10:00', '12:00'), slot(today, '14:00', '16:00')],
    basePricePerHour: 600, minCharge: 500, travelChargePerKm: 50,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=15', joinedAt: '2023-01-10',
  },
  {
    id: 'isb_ac2', name: 'Tariq AC Services', phone: '+92-300-2222222', city: 'Islamabad', area: 'I-8',
    location: { lat: 33.668, lng: 73.074 }, serviceCategories: ['ac_technician'],
    skills: ['ac gas refill', 'ac service', 'ac installation'],
    yearsExperience: 6, rating: 4.7, reviewCount: 89, reviewRecencyScore: 0.85,
    onTimeScore: 0.88, cancellationRate: 0.04, isAvailable: true,
    availableSlots: [slot(today, '11:00', '15:00')],
    basePricePerHour: 2000, minCharge: 1800, travelChargePerKm: 60,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=16', joinedAt: '2021-05-20',
  },
  {
    id: 'isb_ac3', name: 'Premium AC Experts', phone: '+92-300-3333333', city: 'Islamabad', area: 'Blue Area',
    location: { lat: 33.711, lng: 73.060 }, serviceCategories: ['ac_technician'],
    skills: ['ac gas refill', 'compressor repair', 'commercial ac'],
    yearsExperience: 12, rating: 4.9, reviewCount: 300, reviewRecencyScore: 0.95,
    onTimeScore: 0.98, cancellationRate: 0.01, isAvailable: true,
    availableSlots: [slot(today, '09:00', '18:00')],
    basePricePerHour: 2800, minCharge: 2500, travelChargePerKm: 80,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=17', joinedAt: '2019-11-05',
  },
  {
    id: 'isb_ac4', name: 'Sajid AC Repairs', phone: '+92-300-4444444', city: 'Islamabad', area: 'F-10',
    location: { lat: 33.693, lng: 73.010 }, serviceCategories: ['ac_technician'],
    skills: ['ac service', 'ac gas refill'],
    yearsExperience: 2, rating: 3.5, reviewCount: 15, reviewRecencyScore: 0.4,
    onTimeScore: 0.6, cancellationRate: 0.25, isAvailable: true,
    availableSlots: [slot(today, '12:00', '16:00')],
    basePricePerHour: 1200, minCharge: 1000, travelChargePerKm: 40,
    verifiedBadge: false, profilePhotoUrl: 'https://i.pravatar.cc/150?img=18', joinedAt: '2024-02-15',
  },
  {
    id: 'isb_ac5', name: 'Kamran Cooling', phone: '+92-300-5555555', city: 'Islamabad', area: 'G-13',
    location: { lat: 33.647, lng: 72.963 }, serviceCategories: ['ac_technician'],
    skills: ['ac gas refill', 'ac service'],
    yearsExperience: 5, rating: 4.8, reviewCount: 120, reviewRecencyScore: 0.9,
    onTimeScore: 0.95, cancellationRate: 0.02, isAvailable: false,
    availableSlots: [slot(tomorrow, '10:00', '14:00')],
    basePricePerHour: 1800, minCharge: 1500, travelChargePerKm: 50,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=19', joinedAt: '2020-08-11',
  },

  // ─── ISLAMABAD PLUMBERS ──────────────────────────────────────────────
  {
    id: 'isb_p1', name: 'Usman Plumber', phone: '+92-333-1111111', city: 'Islamabad', area: 'G-13',
    location: { lat: 33.647, lng: 72.963 }, serviceCategories: ['plumber'],
    skills: ['pipe fitting', 'leak fixing', 'nala repair'],
    yearsExperience: 7, rating: 4.8, reviewCount: 110, reviewRecencyScore: 0.88,
    onTimeScore: 0.92, cancellationRate: 0.04, isAvailable: true,
    availableSlots: [slot(today, '10:00', '15:00')],
    basePricePerHour: 900, minCharge: 600, travelChargePerKm: 50,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=20', joinedAt: '2021-03-01',
  },
  {
    id: 'isb_p2', name: 'Farooq Plumbing', phone: '+92-333-2222222', city: 'Islamabad', area: 'F-10',
    location: { lat: 33.693, lng: 73.010 }, serviceCategories: ['plumber'],
    skills: ['water pump', 'leak fixing'],
    yearsExperience: 4, rating: 4.4, reviewCount: 50, reviewRecencyScore: 0.7,
    onTimeScore: 0.85, cancellationRate: 0.08, isAvailable: true,
    availableSlots: [slot(today, '12:00', '16:00')],
    basePricePerHour: 800, minCharge: 500, travelChargePerKm: 45,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=21', joinedAt: '2022-06-15',
  },

  // ─── LAHORE PROVIDERS ────────────────────────────────────────────────
  {
    id: 'lhr_ac1', name: 'Bilal AC Master', phone: '+92-300-6666666', city: 'Lahore', area: 'Gulberg',
    location: { lat: 31.520, lng: 74.358 }, serviceCategories: ['ac_technician'],
    skills: ['ac gas refill', 'compressor'],
    yearsExperience: 8, rating: 4.8, reviewCount: 180, reviewRecencyScore: 0.92,
    onTimeScore: 0.94, cancellationRate: 0.02, isAvailable: true,
    availableSlots: [slot(today, '10:00', '14:00')],
    basePricePerHour: 2200, minCharge: 2000, travelChargePerKm: 60,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=22', joinedAt: '2020-01-20',
  },
  {
    id: 'lhr_p1', name: 'Ali Plumber', phone: '+92-300-7777777', city: 'Lahore', area: 'DHA Lahore',
    location: { lat: 31.470, lng: 74.410 }, serviceCategories: ['plumber'],
    skills: ['pipe fitting', 'nala repair'],
    yearsExperience: 6, rating: 4.7, reviewCount: 130, reviewRecencyScore: 0.85,
    onTimeScore: 0.90, cancellationRate: 0.05, isAvailable: true,
    availableSlots: [slot(today, '11:00', '15:00')],
    basePricePerHour: 1000, minCharge: 700, travelChargePerKm: 50,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=23', joinedAt: '2021-09-10',
  },

  // ─── KARACHI PROVIDERS ───────────────────────────────────────────────
  {
    id: 'khi_ac1', name: 'Raza Cool', phone: '+92-300-8888888', city: 'Karachi', area: 'DHA Karachi',
    location: { lat: 24.805, lng: 67.060 }, serviceCategories: ['ac_technician'],
    skills: ['ac gas refill', 'cleaning'],
    yearsExperience: 10, rating: 4.9, reviewCount: 250, reviewRecencyScore: 0.96,
    onTimeScore: 0.97, cancellationRate: 0.01, isAvailable: true,
    availableSlots: [slot(today, '09:00', '18:00')],
    basePricePerHour: 2500, minCharge: 2000, travelChargePerKm: 70,
    verifiedBadge: true, profilePhotoUrl: 'https://i.pravatar.cc/150?img=24', joinedAt: '2018-05-15',
  },
];
