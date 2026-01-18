import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { User, AuthContextType } from '../types';
import { Session } from '@supabase/supabase-js';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Manages authentication state and user data across the app
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load user data from Supabase
   */
  const loadUserData = async (userId: string, email: string) => {
    try {
      let userData = await userService.getUser(userId);

      // If user doesn't exist in database, create new user record
      if (!userData) {
        await userService.createUser(userId, email);
        userData = await userService.getUser(userId);
      }

      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  /**
   * Listen for Supabase auth state changes
   */
  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user.id, session.user.email || '');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // User is signed in
          await loadUserData(session.user.id, session.user.email || '');
        } else {
          // User is signed out
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with Google
   */
  const signIn = async () => {
    try {
      console.log('Starting sign in...');
      const result = await authService.signInWithGoogle();
      console.log('Sign in result:', result);

      // Manually load user data if session was created
      if (result?.session) {
        console.log('Loading user data for:', result.session.user.email);
        await loadUserData(result.session.user.id, result.session.user.email || '');
        console.log('User data loaded successfully');
      } else {
        console.log('No session in result');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  /**
   * Refresh user data from Supabase
   * Used after check-ins to update streak and power
   */
  const refreshUser = async () => {
    if (user) {
      const userData = await userService.getUser(user.id);
      if (userData) {
        setUser(userData);
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 * Use this in components to access auth state and methods
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
