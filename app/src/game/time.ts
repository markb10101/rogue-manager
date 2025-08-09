import { DAY_MINUTES, MOON_PERIOD_DAYS } from './balance';

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function splitDay(minutes: number) {
  const day = Math.floor(minutes / DAY_MINUTES);
  const minuteOfDay = minutes - day * DAY_MINUTES;
  return { day: day + 1, minuteOfDay };
}

export function fmtHHMM(minutes: number) {
  const { minuteOfDay } = splitDay(minutes);
  const unitsPerHour = DAY_MINUTES / 24;
  const hour = Math.floor(minuteOfDay / unitsPerHour);
  const minute = Math.floor((minuteOfDay % unitsPerHour) * (60 / unitsPerHour));
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export function nextPayrollDueAt(now: number) {
  return (Math.floor(now / DAY_MINUTES) + 1) * DAY_MINUTES;
}

export function payrollRemainingMinutes(now: number, dueAt: number) {
  return Math.max(0, dueAt - now);
}

export function moonPhaseLabel(minutes: number) {
  const dayIndex = Math.floor(minutes / DAY_MINUTES) % MOON_PERIOD_DAYS;
  const phases = ['New', 'Waxing', 'Full', 'Waning', 'Dark'];
  return phases[dayIndex];
}
