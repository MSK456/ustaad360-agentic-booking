export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatTime = (date: Date): string =>
  date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true });

export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * 60_000);

export const addHours = (date: Date, hours: number): Date =>
  new Date(date.getTime() + hours * 3_600_000);

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 86_400_000);

export const isoNow = (): string => new Date().toISOString();

export const shortId = (): string =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const bookingId = (): string => `B-U360-${shortId()}`;

export const timeLabel = (urgency: string): string => {
  const now = new Date();
  if (urgency === 'emergency') return formatTime(addMinutes(now, 30));
  if (urgency === 'high')      return '09:00 AM';
  return '10:00 AM';
};

export const dateLabel = (timePreference: string): string => {
  const now = new Date();
  if (timePreference.includes('today')) return formatDate(now);
  if (timePreference.includes('tomorrow')) return formatDate(addDays(now, 1));
  return formatDate(addDays(now, 1));
};
