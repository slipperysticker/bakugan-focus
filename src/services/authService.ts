import { supabase } from '../config/supabase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Required for Expo AuthSession
WebBrowser.maybeCompleteAuthSession();

/**
 * Auth Service for Supabase Authentication
 * Uses Expo AuthSession for Google OAuth
 *
 * IMPORTANT: You need to configure Google OAuth in Supabase Dashboard:
 * 1. Go to Authentication > Providers > Google
 * 2. Enable Google provider
 * 3. Add your Google OAuth Client ID and Secret
 */

export const authService = {
  /**
   * Sign in with Google using Supabase Auth
   * Uses Expo AuthSession for OAuth flow
   */
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'bakuganfocus://auth/callback',
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  /**
   * Sign out from Supabase
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
};
