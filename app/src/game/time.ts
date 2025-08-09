import { DAY_MINUTES, MOON_PERIOD_DAYS } from './balance'

export function clamp(n: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, n));
}

export function splitDay(totalMinutes: number) {
  const day = Math.floor(totalMinutes / DAY_MINUTES) + 1;
  const minuteOfDay = totalMinutes % DAY_MINUTES;
  return { day, minuteOfDay };
}

export function fmtHHMM(totalMinutes: number) {
  const { minuteOfDay } = splitDay(totalMinutes);
  const minutes = Math.floor(minuteOfDay);
  const hours = Math.floor((minutes / DAY_MINUTES) * 24);
  const mins = Math.floor(((minutes % (DAY_MINUTES / 24)) * 24 * 60) / DAY_MINUTES);
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function nextPayrollDueAt(currentMinutes: number) {
  const minutesPerMoon = DAY_MINUTES * MOON_PERIOD_DAYS;
  const next = Math.ceil(currentMinutes / minutesPerMoon) * minutesPerMoon || minutesPerMoon;
  return next;
}

export function payrollRemainingMinutes(currentMinutes: number) {
  const due = nextPayrollDueAt(currentMinutes);
  return { dueAt: due, remaining: Math.max(0, due - currentMinutes) };
}

export function moonPhaseLabel(currentMinutes: number) {
  const { day } = splitDay(currentMinutes);
  const phase = (day - 1) % MOON_PERIOD_DAYS;
  return ["New", "Waxing", "Full", "Waning", "Dark"][phase] ?? "—";
}
