# Zustand Stores and AsyncStorage Persistence
1. `useAuthStore`: Caches active User Profiles or Guest flags. Persists state key `@ustaad360_user` inside native `AsyncStorage`. Hydrated on startup.
2. `useBookingStore`: Array of booked service records. Backed by `persist` middleware inside `@ustaad360-bookings`. Manages updates for timeline steps, checks double-bookings, resolves schedule conflicts.
3. `useAgentStore`: Temporarily stores intent query results, dynamic traces, chosen provider, and compared metrics.
