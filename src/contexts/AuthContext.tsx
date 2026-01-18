import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { User, AuthContextType } from '../types';

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
   * Load user data from Firestore
   */
  const loadUserData = async (uid: string) => {
    try {
      let userData = await userService.getUser(uid);

      // If user doesn't exist in Firestore, create new user document
      if (!userData) {
        await userService.createUser(uid);
        userData = await userService.getUser(uid);
      }

      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  /**
   * Listen for Firebase auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        await loadUserData(firebaseUser.uid);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  /**
   * Sign in with Google
   */
  const signIn = async () => {
    try {
      const firebaseUser = await authService.signInWithGoogle();
      if (firebaseUser) {
        await loadUserData(firebaseUser.uid);
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
   * Refresh user data from Firestore
   * Used after check-ins to update streak and power
   */
  const refreshUser = async () => {
    if (user) {
      await loadUserData(user.uid);
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
