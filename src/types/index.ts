// Database types for Supabase PostgreSQL

// Users table
export interface User {
  id: string; // UUID from Supabase Auth
  email: string;
  created_at: string; // ISO timestamp
  current_streak: number;
  max_streak: number;
  power: number;
  last_check_in_date: string | null; // YYYY-MM-DD format
}

// Check-ins table
export interface CheckIn {
  id: number; // Auto-increment primary key
  user_id: string; // Foreign key to users.id
  date: string; // YYYY-MM-DD format (unique per user)
  completed: boolean;
  created_at: string; // ISO timestamp
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Supabase table definitions for type safety
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      check_ins: {
        Row: CheckIn;
        Insert: Omit<CheckIn, 'id' | 'created_at'>;
        Update: Partial<Omit<CheckIn, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
};
