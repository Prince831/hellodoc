-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update profiles table with additional fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blood_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allergies TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_relation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medical_history TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS insurance_provider TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT;

-- Update doctors table with additional fields
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS clinic_address TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS working_hours JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS consultation_types TEXT[];

-- Create appointment_statuses table for better status management
CREATE TABLE IF NOT EXISTS public.appointment_statuses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default appointment statuses
INSERT INTO public.appointment_statuses (id, name, description, color) VALUES
('pending', 'Pending', 'Appointment request submitted, awaiting approval', '#f59e0b'),
('confirmed', 'Confirmed', 'Appointment confirmed by doctor', '#10b981'),
('in_progress', 'In Progress', 'Appointment currently ongoing', '#3b82f6'),
('completed', 'Completed', 'Appointment finished successfully', '#6b7280'),
('cancelled', 'Cancelled', 'Appointment cancelled', '#ef4444'),
('no_show', 'No Show', 'Patient did not attend appointment', '#dc2626'),
('rescheduled', 'Rescheduled', 'Appointment moved to different time', '#8b5cf6')
ON CONFLICT (id) DO NOTHING;

-- Create specializations table
CREATE TABLE IF NOT EXISTS public.specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert common medical specializations
INSERT INTO public.specializations (name, description, keywords) VALUES
('General Practice', 'Primary healthcare for all ages', ARRAY['general', 'primary care', 'family medicine', 'checkup']),
('Cardiology', 'Heart and cardiovascular system', ARRAY['heart', 'chest pain', 'blood pressure', 'cardiovascular']),
('Dermatology', 'Skin, hair, and nail conditions', ARRAY['skin', 'rash', 'acne', 'dermatology', 'eczema']),
('Orthopedics', 'Bones, joints, and musculoskeletal system', ARRAY['bone', 'joint', 'fracture', 'orthopedics', 'muscle']),
('Pediatrics', 'Medical care for children', ARRAY['children', 'pediatrics', 'kids', 'infant', 'child']),
('Neurology', 'Brain and nervous system', ARRAY['brain', 'headache', 'neurology', 'seizure', 'migraine']),
('Psychiatry', 'Mental health and behavioral disorders', ARRAY['mental health', 'depression', 'anxiety', 'psychiatry']),
('Ophthalmology', 'Eye and vision care', ARRAY['eye', 'vision', 'ophthalmology', 'glasses', 'sight']),
('Gynecology', 'Women''s reproductive health', ARRAY['women', 'gynecology', 'pregnancy', 'reproductive']),
('Urology', 'Urinary system and male reproductive health', ARRAY['urology', 'kidney', 'bladder', 'urinary'])
ON CONFLICT (name) DO NOTHING;

-- Create medical_conditions table
CREATE TABLE IF NOT EXISTS public.medical_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    symptoms TEXT[],
    specialization_id UUID REFERENCES public.specializations(id),
    severity_level INTEGER DEFAULT 1, -- 1-5 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create lab_results table
CREATE TABLE IF NOT EXISTS public.lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id),
    test_name TEXT NOT NULL,
    test_date DATE NOT NULL,
    results JSONB NOT NULL,
    reference_ranges JSONB,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create vitals table for tracking patient vitals
CREATE TABLE IF NOT EXISTS public.vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES public.doctors(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature DECIMAL(4,1),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    oxygen_saturation INTEGER,
    respiratory_rate INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create prescription_items table for detailed medication tracking
CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
    quantity INTEGER,
    refills_remaining INTEGER DEFAULT 0,
    pharmacy_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create doctor_schedules table
CREATE TABLE IF NOT EXISTS public.doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0-6 (Sunday-Saturday)
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    break_start_time TIME,
    break_end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create doctor_unavailability table for tracking time off
CREATE TABLE IF NOT EXISTS public.doctor_unavailability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create appointment_notes table for detailed appointment records
CREATE TABLE IF NOT EXISTS public.appointment_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    note_type TEXT DEFAULT 'general', -- general, diagnosis, treatment, follow_up
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on new tables
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for specializations and medical_conditions (public read)
CREATE POLICY "Anyone can view specializations" ON public.specializations FOR SELECT USING (true);
CREATE POLICY "Anyone can view medical conditions" ON public.medical_conditions FOR SELECT USING (true);

-- RLS Policies for lab_results
CREATE POLICY "Users can view their own lab results" ON public.lab_results 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lab results" ON public.lab_results 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lab results" ON public.lab_results 
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for vitals
CREATE POLICY "Users can view their own vitals" ON public.vitals 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vitals" ON public.vitals 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vitals" ON public.vitals 
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for prescription_items
CREATE POLICY "Users can view their prescription items" ON public.prescription_items 
FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.medications m 
    WHERE m.id = prescription_items.medication_id 
    AND m.user_id = auth.uid()
));

-- RLS Policies for doctor_schedules
CREATE POLICY "Anyone can view doctor schedules" ON public.doctor_schedules FOR SELECT USING (true);

-- RLS Policies for doctor_unavailability  
CREATE POLICY "Anyone can view doctor unavailability" ON public.doctor_unavailability FOR SELECT USING (true);

-- RLS Policies for appointment_notes
CREATE POLICY "Users can view their appointment notes" ON public.appointment_notes 
FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = appointment_notes.appointment_id 
    AND a.user_id = auth.uid()
));

CREATE POLICY "Users can create appointment notes" ON public.appointment_notes 
FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = appointment_notes.appointment_id 
    AND (a.user_id = auth.uid() OR a.doctor_id = auth.uid())
));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lab_results_user_id ON public.lab_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_date ON public.lab_results(test_date);
CREATE INDEX IF NOT EXISTS idx_vitals_user_id ON public.vitals(user_id);
CREATE INDEX IF NOT EXISTS idx_vitals_recorded_at ON public.vitals(recorded_at);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_id ON public.doctor_schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_unavailability_doctor_id ON public.doctor_unavailability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointment_notes_appointment_id ON public.appointment_notes(appointment_id);
CREATE INDEX IF NOT EXISTS idx_medical_conditions_specialization ON public.medical_conditions(specialization_id);

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_lab_results_updated_at ON public.lab_results;
CREATE TRIGGER update_lab_results_updated_at
    BEFORE UPDATE ON public.lab_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointment_notes_updated_at ON public.appointment_notes;
CREATE TRIGGER update_appointment_notes_updated_at
    BEFORE UPDATE ON public.appointment_notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();