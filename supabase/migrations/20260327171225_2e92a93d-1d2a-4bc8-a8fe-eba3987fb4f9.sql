-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Financial profiles table
CREATE TABLE public.financial_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_income integer NOT NULL DEFAULT 0,
  monthly_expenses integer NOT NULL DEFAULT 0,
  total_savings integer NOT NULL DEFAULT 0,
  total_investments integer NOT NULL DEFAULT 0,
  total_debt integer NOT NULL DEFAULT 0,
  monthly_emi integer NOT NULL DEFAULT 0,
  monthly_rent integer NOT NULL DEFAULT 0,
  monthly_sip integer NOT NULL DEFAULT 0,
  age integer NOT NULL DEFAULT 25,
  retirement_age integer NOT NULL DEFAULT 60,
  expected_return numeric NOT NULL DEFAULT 12,
  inflation_rate numeric NOT NULL DEFAULT 6,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.financial_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own financial profile" ON public.financial_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial profile" ON public.financial_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial profile" ON public.financial_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();