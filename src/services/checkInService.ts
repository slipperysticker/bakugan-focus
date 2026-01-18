import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getTodayString } from '../utils/dateUtils';
import { calculateNewStreak } from '../utils/streakCalculator';
import { userService } from './userService';

export const checkInService = {
  /**
   * Check if user has already checked in today
   * @param uid - User ID
   * @returns true if already checked in today, false otherwise
   */
  async hasCheckedInToday(uid: string): Promise<boolean> {
    try {
      const today = getTodayString();
      const checkInId = `${uid}_${today}`;
      const checkInRef = doc(db, 'checkIns', checkInId);
      const checkInSnap = await getDoc(checkInRef);

      return checkInSnap.exists();
    } catch (error) {
      console.error('Error checking today status:', error);
      throw error;
    }
  },

  /**
   * Create a new check-in for today
   * Updates user's streak and power level
   *
   * @param uid - User ID
   * @throws Error if already checked in today or user not found
   */
  async createCheckIn(uid: string): Promise<void> {
    try {
      const today = getTodayString();

      // Prevent duplicate check-ins for the same day
      const alreadyCheckedIn = await this.hasCheckedInToday(uid);
      if (alreadyCheckedIn) {
        throw new Error('Already checked in today');
      }

      // Get current user data
      const userData = await userService.getUser(uid);
      if (!userData) {
        throw new Error('User not found');
      }

      // Calculate new streak based on last check-in date
      const newStreak = calculateNewStreak(
        userData.lastCheckInDate,
        userData.currentStreak
      );

      // Create check-in document with composite ID: uid_YYYY-MM-DD
      const checkInId = `${uid}_${today}`;
      await setDoc(doc(db, 'checkIns', checkInId), {
        uid,
        date: today,
        completed: true
      });

      // Update user document with new values
      await userService.updateUser(uid, {
        currentStreak: newStreak,
        maxStreak: Math.max(newStreak, userData.maxStreak),
        power: userData.power + 1,
        lastCheckInDate: today
      });

    } catch (error) {
      console.error('Error creating check-in:', error);
      throw error;
    }
  }
};
