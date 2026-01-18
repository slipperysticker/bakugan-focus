import { supabase } from '../config/supabase';
import { User } from '../types';

export const userService = {
  /**
   * Get user data from Supabase
   * @param userId - User ID from Supabase Auth
   * @returns User data or null if not found
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  /**
   * Create a new user in Supabase
   * Called after first Google Sign-In
   * @param userId - User ID from Supabase Auth
   * @param email - User email from Supabase Auth
   */
  async createUser(userId: string, email: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          current_streak: 0,
          max_streak: 0,
          power: 0,
          last_check_in_date: null,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update user data in Supabase
   * Used after check-ins to update streak and power
   * @param userId - User ID
   * @param updates - Partial user data to update
   */
  async updateUser(
    userId: string,
    updates: {
      current_streak?: number;
      max_streak?: number;
      power?: number;
      last_check_in_date?: string;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};
