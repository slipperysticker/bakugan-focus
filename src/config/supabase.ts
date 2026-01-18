import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

/**
 * Supabase configuration
 * Credentials from Supabase Dashboard > Project Settings > API
 */
const supabaseUrl = 'https://mmeshpxloyttkoohpobv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZXNocHhsb3l0dGtvb2hwb2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MDI0MjIsImV4cCI6MjA4NDI3ODQyMn0.XYzywebm5bRBVnnHvl8zGwNyBZc_CDd1ObfzuwYeL6A';

/**
 * Initialize Supabase client
 * Configured for React Native with AsyncStorage for session persistence
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
