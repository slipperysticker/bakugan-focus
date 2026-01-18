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
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      // Open the OAuth URL in browser
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          'bakuganfocus://auth/callback'
        );

        if (result.type === 'success' && result.url) {
          // Parse the URL to extract the tokens from hash fragment
          const url = new URL(result.url);
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            // Set the session with the tokens
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) throw sessionError;
            return sessionData;
          }
        }
      }

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
