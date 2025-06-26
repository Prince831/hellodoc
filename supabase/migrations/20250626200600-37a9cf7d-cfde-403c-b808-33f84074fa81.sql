
-- First, let's check what policies already exist and drop/recreate them if needed
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own symptom checks" ON public.symptom_checks;
    DROP POLICY IF EXISTS "Users can create their own symptom checks" ON public.symptom_checks;
END $$;

-- Create profiles table to store user information and roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
END $$;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
    -- Check and add foreign keys if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'appointments_user_id_fkey' 
        AND table_name = 'appointments'
    ) THEN
        ALTER TABLE public.appointments ADD CONSTRAINT appointments_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'health_records_user_id_fkey' 
        AND table_name = 'health_records'
    ) THEN
        ALTER TABLE public.health_records ADD CONSTRAINT health_records_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_sender_id_fkey' 
        AND table_name = 'messages'
    ) THEN
        ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey 
        FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_receiver_id_fkey' 
        AND table_name = 'messages'
    ) THEN
        ALTER TABLE public.messages ADD CONSTRAINT messages_receiver_id_fkey 
        FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS on existing tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_checks ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for all tables
DO $$ 
BEGIN
    -- Appointments policies
    DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
    DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
    DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
    
    -- Health records policies
    DROP POLICY IF EXISTS "Users can view their own health records" ON public.health_records;
    DROP POLICY IF EXISTS "Users can create their own health records" ON public.health_records;
    
    -- Messages policies
    DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
    DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
END $$;

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for health records
CREATE POLICY "Users can view their own health records" ON public.health_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health records" ON public.health_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create RLS policies for symptom checks
CREATE POLICY "Users can view their own symptom checks" ON public.symptom_checks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own symptom checks" ON public.symptom_checks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create helper function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
