import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

export const userService = {
  /**
   * Get user data from Firestore
   * @param uid - User ID
   * @returns User data or null if not found
   */
  async getUser(uid: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        return {
          ...userData,
          // Convert Firestore Timestamp to Date object
          createdAt: userData.createdAt.toDate(),
        } as User;
      }

      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  /**
   * Create a new user document in Firestore
   * Called after first Google Sign-In
   * @param uid - User ID from Firebase Auth
   */
  async createUser(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);

      // Initialize new user with default values
      await setDoc(userRef, {
        uid,
        createdAt: Timestamp.now(),
        currentStreak: 0,
        maxStreak: 0,
        power: 0,
        lastCheckInDate: '', // Empty string indicates no check-ins yet
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update user data in Firestore
   * Used after check-ins to update streak and power
   * @param uid - User ID
   * @param updates - Partial user data to update
   */
  async updateUser(uid: string, updates: Partial<Omit<User, 'uid' | 'createdAt'>>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};
