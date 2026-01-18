import { getYesterdayString, getTodayString } from './dateUtils';

/**
 * Calculate the new streak value based on last check-in date
 *
 * Logic:
 * - If last check-in was yesterday: increment streak (consecutive days)
 * - If last check-in was today: maintain current streak (shouldn't happen with validation)
 * - If gap of 1+ days: reset streak to 1 (new streak starts)
 * - If no previous check-in: return 1 (first check-in)
 *
 * @param lastCheckInDate - Last check-in date in YYYY-MM-DD format
 * @param currentStreak - Current streak value
 * @returns New streak value
 */
export const calculateNewStreak = (
  lastCheckInDate: string,
  currentStreak: number
): number => {
  const yesterday = getYesterdayString();
  const today = getTodayString();

  // If last check-in was yesterday, increment streak (consecutive)
  if (lastCheckInDate === yesterday) {
    return currentStreak + 1;
  }

  // If last check-in was today, maintain streak (duplicate prevention should catch this)
  if (lastCheckInDate === today) {
    return currentStreak;
  }

  // Any gap means streak resets to 1 (starting fresh)
  return 1;
};
