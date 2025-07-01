
-- Add missing fields to doctors table for comprehensive doctor profiles
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS languages TEXT[];
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL(10,2);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS hospital TEXT;

-- Create medications table for patient medication tracking
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  instructions TEXT,
  prescribed_by UUID REFERENCES doctors(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create conversations table for better message organization
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  subject TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Update messages table to reference conversations
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;

-- Create notifications table for better user notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create video_consultations table
CREATE TABLE IF NOT EXISTS video_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
  room_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on all new tables
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_consultations ENABLE ROW LEVEL SECURITY;

-- RLS policies for medications
CREATE POLICY "Users can view their own medications" ON medications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own medications" ON medications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own medications" ON medications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own medications" ON medications FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for conversations
CREATE POLICY "Users can view their conversations" ON conversations FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users can update their conversations" ON conversations FOR UPDATE USING (auth.uid() = patient_id);

-- RLS policies for notifications
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for video consultations
CREATE POLICY "Users can view their video consultations" ON video_consultations 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM appointments 
    WHERE appointments.id = video_consultations.appointment_id 
    AND appointments.user_id = auth.uid()
  )
);

-- Update sample doctors with more comprehensive data
UPDATE doctors SET 
  phone = '+1 (555) 123-4567',
  email = 'sarah.johnson@hospital.com',
  bio = 'Dr. Sarah Johnson is a dedicated family medicine physician with over 8 years of experience providing comprehensive healthcare.',
  education = 'MD from Harvard Medical School, Residency at Johns Hopkins',
  languages = ARRAY['English', 'Spanish'],
  consultation_fee = 150.00,
  hospital = 'City General Hospital'
WHERE name = 'Dr. Sarah Johnson';

UPDATE doctors SET 
  phone = '+1 (555) 234-5678',
  email = 'michael.chen@cardio.com',
  bio = 'Specialized cardiologist with expertise in interventional cardiology and heart disease prevention.',
  education = 'MD from Stanford University, Cardiology Fellowship at Mayo Clinic',
  languages = ARRAY['English', 'Mandarin'],
  consultation_fee = 250.00,
  hospital = 'Heart Center Medical'
WHERE name = 'Dr. Michael Chen';

UPDATE doctors SET 
  phone = '+1 (555) 345-6789',
  email = 'emily.rodriguez@derma.com',
  bio = 'Board-certified dermatologist specializing in medical and cosmetic dermatology.',
  education = 'MD from UCLA, Dermatology Residency at UCSF',
  languages = ARRAY['English', 'Spanish', 'Portuguese'],
  consultation_fee = 200.00,
  hospital = 'Skin Health Institute'
WHERE name = 'Dr. Emily Rodriguez';

-- Add more sample doctors for better variety
INSERT INTO doctors (name, specialization, years_of_experience, rating, availability, keywords, image_url, phone, email, bio, education, languages, consultation_fee, hospital) VALUES
('Dr. David Kim', 'Psychiatry', 9, 4.7, true, ARRAY['mental health', 'anxiety', 'depression', 'therapy'], 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face', '+1 (555) 456-7890', 'david.kim@mindcare.com', 'Compassionate psychiatrist specializing in anxiety, depression, and cognitive behavioral therapy.', 'MD from Columbia University, Psychiatry Residency at Mount Sinai', ARRAY['English', 'Korean'], 180.00, 'Mental Health Center'),
('Dr. Anna Martinez', 'Neurology', 11, 4.8, true, ARRAY['headache', 'migraine', 'neurology', 'seizure'], 'https://images.unsplash.com/photo-1594824388853-d0c949e40d8a?w=400&h=400&fit=crop&crop=face', '+1 (555) 567-8901', 'anna.martinez@neuro.com', 'Expert neurologist with focus on headache disorders and epilepsy management.', 'MD from Yale University, Neurology Fellowship at Cleveland Clinic', ARRAY['English', 'Spanish'], 220.00, 'Neuroscience Institute'),
('Dr. Robert Thompson', 'Emergency Medicine', 7, 4.6, true, ARRAY['emergency', 'trauma', 'urgent care', 'critical'], 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face', '+1 (555) 678-9012', 'robert.thompson@emergency.com', 'Emergency medicine physician with expertise in trauma care and critical situations.', 'MD from University of Michigan, Emergency Medicine Residency at Johns Hopkins', ARRAY['English'], 300.00, 'Emergency Medical Center')
ON CONFLICT DO NOTHING;
