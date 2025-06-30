
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can view doctors" ON doctors;

-- Add sample doctors to the database
INSERT INTO doctors (name, specialization, years_of_experience, rating, availability, keywords, image_url) VALUES
('Dr. Sarah Johnson', 'General Practice', 8, 4.8, true, ARRAY['general', 'consultation', 'primary care', 'family medicine'], 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'),
('Dr. Michael Chen', 'Cardiology', 12, 4.9, true, ARRAY['heart', 'chest pain', 'cardiology', 'hypertension'], 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face'),
('Dr. Emily Rodriguez', 'Dermatology', 6, 4.7, true, ARRAY['skin', 'rash', 'dermatology', 'acne'], 'https://images.unsplash.com/photo-1594824388853-d0c949e40d8a?w=400&h=400&fit=crop&crop=face'),
('Dr. James Wilson', 'Orthopedics', 15, 4.6, true, ARRAY['bone', 'joint', 'orthopedics', 'fracture'], 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face'),
('Dr. Lisa Park', 'Pediatrics', 10, 4.9, true, ARRAY['children', 'pediatrics', 'fever', 'vaccination'], 'https://images.unsplash.com/photo-1643210911290-7b47c7e4d3cc?w=400&h=400&fit=crop&crop=face')
ON CONFLICT DO NOTHING;

-- Enable RLS on doctors table
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read doctors (since it's public information)
CREATE POLICY "Anyone can view doctors" ON doctors FOR SELECT USING (true);

-- Enable RLS on appointments table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Users can view their own appointments" ON appointments 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" ON appointments 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON appointments 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments" ON appointments 
FOR DELETE USING (auth.uid() = user_id);
