// User data structure in Firestore
export interface User {
  uid: string;
  createdAt: Date;
  currentStreak: number;
  maxStreak: number;
  power: number;
  lastCheckInDate: string; // YYYY-MM-DD format
}

// CheckIn data structure in Firestore
export interface CheckIn {
  uid: string;
  date: string; // YYYY-MM-DD format
  completed: true;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
