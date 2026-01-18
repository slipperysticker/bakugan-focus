import { supabase } from '../config/supabase';
import { getTodayString } from '../utils/dateUtils';
import { calculateNewStreak } from '../utils/streakCalculator';
import { userService } from './userService';

export const checkInService = {
  /**
   * Check if user has already checked in today
   * @param userId - User ID
   * @returns true if already checked in today, false otherwise
   */
  async hasCheckedInToday(userId: string): Promise<boolean> {
    try {
      const today = getTodayString();

      const { data, error } = await supabase
        .from('check_ins')
        .select('id')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - not checked in today
          return false;
        }
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking today status:', error);
      throw error;
    }
  },

  /**
   * Create a new check-in for today
   * Updates user's streak and power level
   *
   * @param userId - User ID
   * @throws Error if already checked in today or user not found
   */
  async createCheckIn(userId: string): Promise<void> {
    try {
      const today = getTodayString();

      // Prevent duplicate check-ins for the same day
      const alreadyCheckedIn = await this.hasCheckedInToday(userId);
      if (alreadyCheckedIn) {
        throw new Error('Already checked in today');
      }

      // Get current user data
      const userData = await userService.getUser(userId);
      if (!userData) {
        throw new Error('User not found');
      }

      // Calculate new streak based on last check-in date
      const newStreak = calculateNewStreak(
        userData.last_check_in_date || '',
        userData.current_streak
      );

      // Create check-in record
      const { error: checkInError } = await supabase
        .from('check_ins')
        .insert({
          user_id: userId,
          date: today,
          completed: true
        });

      if (checkInError) throw checkInError;

      // Update user record with new values
      await userService.updateUser(userId, {
        current_streak: newStreak,
        max_streak: Math.max(newStreak, userData.max_streak),
        power: userData.power + 1,
        last_check_in_date: today
      });

    } catch (error) {
      console.error('Error creating check-in:', error);
      throw error;
    }
  }
};
