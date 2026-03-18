/**
 * WoW weekly reset calculations.
 * US servers reset every Tuesday at 10:00 AM CT (15:00 UTC).
 */

const RESET_DAY = 2; // Tuesday
const RESET_HOUR_UTC = 15; // 10 AM CT = 15:00 UTC

export function getNextReset(): Date {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(RESET_HOUR_UTC, 0, 0, 0);

  // Find next Tuesday
  const daysUntilTuesday = (RESET_DAY - now.getUTCDay() + 7) % 7;
  if (daysUntilTuesday === 0 && now.getUTCHours() >= RESET_HOUR_UTC) {
    next.setUTCDate(next.getUTCDate() + 7);
  } else {
    next.setUTCDate(next.getUTCDate() + daysUntilTuesday);
  }

  return next;
}

export function getLastReset(): Date {
  const next = getNextReset();
  const last = new Date(next);
  last.setUTCDate(last.getUTCDate() - 7);
  return last;
}

export function getResetInfo() {
  const now = new Date();
  const next = getNextReset();
  const last = getLastReset();

  const msUntilReset = next.getTime() - now.getTime();
  const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60));
  const daysUntilReset = Math.floor(hoursUntilReset / 24);
  const remainingHours = hoursUntilReset % 24;

  // Week progress: 0 = just reset, 1 = about to reset
  const weekDuration = 7 * 24 * 60 * 60 * 1000;
  const elapsed = now.getTime() - last.getTime();
  const weekProgress = Math.min(elapsed / weekDuration, 1);

  // Day of the week relative to reset
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
  const isResetDay = now.getUTCDay() === RESET_DAY && now.getUTCHours() < RESET_HOUR_UTC + 2;

  // Urgency level
  let urgency: 'fresh' | 'midweek' | 'urgent' | 'critical';
  if (daysUntilReset >= 5) urgency = 'fresh';
  else if (daysUntilReset >= 3) urgency = 'midweek';
  else if (daysUntilReset >= 1) urgency = 'urgent';
  else urgency = 'critical';

  return {
    nextReset: next,
    lastReset: last,
    daysUntilReset,
    hoursUntilReset,
    remainingHours,
    weekProgress,
    dayOfWeek,
    isResetDay,
    urgency,
    timeString: daysUntilReset > 0
      ? `${daysUntilReset}d ${remainingHours}h`
      : `${hoursUntilReset}h`,
  };
}
