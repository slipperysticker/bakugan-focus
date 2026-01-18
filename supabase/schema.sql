-- Bakugan Focus Database Schema for Supabase
-- Run this in Supabase SQL Editor to create tables

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  max_streak INTEGER DEFAULT 0 NOT NULL,
  power INTEGER DEFAULT 0 NOT NULL,
  last_check_in_date DATE
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS public.check_ins (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure one check-in per user per day
  UNIQUE(user_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON public.check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON public.check_ins(date);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_date ON public.check_ins(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own data (on first sign-in)
CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Check-ins table policies
-- Users can read their own check-ins
CREATE POLICY "Users can read own check-ins"
  ON public.check_ins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own check-ins
CREATE POLICY "Users can insert own check-ins"
  ON public.check_ins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own check-ins
CREATE POLICY "Users can update own check-ins"
  ON public.check_ins
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: Create a function to automatically create user record on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, current_streak, max_streak, power)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    0,
    0,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create user record
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User profiles with streak and power data';
COMMENT ON TABLE public.check_ins IS 'Daily check-in records';
COMMENT ON COLUMN public.users.current_streak IS 'Current consecutive days streak';
COMMENT ON COLUMN public.users.max_streak IS 'Highest streak ever achieved';
COMMENT ON COLUMN public.users.power IS 'Total check-ins (never decreases)';
COMMENT ON COLUMN public.users.last_check_in_date IS 'Last day user checked in (YYYY-MM-DD)';
