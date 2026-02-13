
-- Table to track page visits
CREATE TABLE public.page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (tracking)
CREATE POLICY "Anyone can insert visits" ON public.page_visits
  FOR INSERT WITH CHECK (true);

-- Only authenticated admins can read
CREATE POLICY "Authenticated users can read visits" ON public.page_visits
  FOR SELECT TO authenticated USING (true);

-- Table to track active sessions (online users)
CREATE TABLE public.active_sessions (
  id TEXT PRIMARY KEY,
  page TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upsert sessions" ON public.active_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update sessions" ON public.active_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can read sessions" ON public.active_sessions
  FOR SELECT TO authenticated USING (true);

-- Allow anonymous deletes for cleanup
CREATE POLICY "Anyone can delete old sessions" ON public.active_sessions
  FOR DELETE USING (true);

-- Table for captured form data
CREATE TABLE public.captured_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  step TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.captured_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert captured data" ON public.captured_data
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read captured data" ON public.captured_data
  FOR SELECT TO authenticated USING (true);

-- Profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
