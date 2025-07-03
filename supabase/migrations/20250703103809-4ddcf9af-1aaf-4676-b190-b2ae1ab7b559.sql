
-- Ensure we have comprehensive doctor profiles
INSERT INTO doctors (name, specialization, years_of_experience, rating, availability, keywords, image_url, phone, email, bio, education, languages, consultation_fee, hospital) VALUES
('Dr. Sarah Johnson', 'General Practitioner', 8, 4.8, true, ARRAY['general', 'checkup', 'family medicine', 'preventive care'], 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face', '+1 (555) 123-4567', 'sarah.johnson@hospital.com', 'Dr. Sarah Johnson is a dedicated family medicine physician with over 8 years of experience providing comprehensive healthcare to patients of all ages.', 'MD from Harvard Medical School, Residency at Johns Hopkins Hospital', ARRAY['English', 'Spanish'], 150.00, 'City General Hospital'),
('Dr. Michael Chen', 'Cardiologist', 12, 4.9, true, ARRAY['heart', 'cardiology', 'chest pain', 'blood pressure'], 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face', '+1 (555) 234-5678', 'michael.chen@cardio.com', 'Specialized cardiologist with expertise in interventional cardiology, heart disease prevention, and cardiac rehabilitation.', 'MD from Stanford University, Cardiology Fellowship at Mayo Clinic', ARRAY['English', 'Mandarin'], 250.00, 'Heart Center Medical'),
('Dr. Emily Rodriguez', 'Dermatologist', 6, 4.7, true, ARRAY['skin', 'dermatology', 'rash', 'acne'], 'https://images.unsplash.com/photo-1594824388853-d0c949e40d8a?w=400&h=400&fit=crop&crop=face', '+1 (555) 345-6789', 'emily.rodriguez@derma.com', 'Board-certified dermatologist specializing in medical and cosmetic dermatology with a focus on skin cancer prevention.', 'MD from UCLA School of Medicine, Dermatology Residency at UCSF', ARRAY['English', 'Spanish', 'Portuguese'], 200.00, 'Skin Health Institute'),
('Dr. David Kim', 'Psychiatrist', 9, 4.7, true, ARRAY['mental health', 'anxiety', 'depression', 'therapy'], 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face', '+1 (555) 456-7890', 'david.kim@mindcare.com', 'Compassionate psychiatrist specializing in anxiety disorders, depression, and cognitive behavioral therapy approaches.', 'MD from Columbia University, Psychiatry Residency at Mount Sinai Hospital', ARRAY['English', 'Korean'], 180.00, 'Mental Health Center'),
('Dr. Anna Martinez', 'Neurologist', 11, 4.8, true, ARRAY['headache', 'migraine', 'neurology', 'seizure'], 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face', '+1 (555) 567-8901', 'anna.martinez@neuro.com', 'Expert neurologist with focus on headache disorders, epilepsy management, and neurological rehabilitation.', 'MD from Yale University School of Medicine, Neurology Fellowship at Cleveland Clinic', ARRAY['English', 'Spanish'], 220.00, 'Neuroscience Institute')
ON CONFLICT (name) DO UPDATE SET
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  bio = EXCLUDED.bio,
  education = EXCLUDED.education,
  languages = EXCLUDED.languages,
  consultation_fee = EXCLUDED.consultation_fee,
  hospital = EXCLUDED.hospital;

-- Ensure we have proper sample data for testing
INSERT INTO profiles (id, full_name, email, role, phone, address, date_of_birth, gender) VALUES
('00000000-0000-0000-0000-000000000001', 'John Patient', 'patient@example.com', 'patient', '+1 (555) 111-2222', '123 Main St, City, State 12345', '1990-01-15', 'male')
ON CONFLICT (id) DO NOTHING;

-- Add some sample appointments for testing
INSERT INTO appointments (user_id, doctor_id, date, reason, status, notes) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson' LIMIT 1), '2024-01-20 10:00:00+00', 'Regular checkup', 'confirmed', 'Annual physical examination'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM doctors WHERE name = 'Dr. Michael Chen' LIMIT 1), '2024-01-25 14:30:00+00', 'Heart consultation', 'pending', 'Follow-up for blood pressure monitoring')
ON CONFLICT DO NOTHING;

-- Add sample conversations and messages
INSERT INTO conversations (patient_id, doctor_id, subject, status) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson' LIMIT 1), 'General Health Questions', 'active'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM doctors WHERE name = 'Dr. Michael Chen' LIMIT 1), 'Heart Health Follow-up', 'active')
ON CONFLICT DO NOTHING;

-- Add sample messages
INSERT INTO messages (sender_id, receiver_id, content, conversation_id, read) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson' LIMIT 1), 'Hello Dr. Johnson, I have some questions about my recent test results.', (SELECT id FROM conversations WHERE patient_id = '00000000-0000-0000-0000-000000000001' AND subject = 'General Health Questions' LIMIT 1), false),
((SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson' LIMIT 1), '00000000-0000-0000-0000-000000000001', 'Hello! I would be happy to discuss your test results. Can you tell me which specific tests you are referring to?', (SELECT id FROM conversations WHERE patient_id = '00000000-0000-0000-0000-000000000001' AND subject = 'General Health Questions' LIMIT 1), true)
ON CONFLICT DO NOTHING;

-- Add sample medications
INSERT INTO medications (user_id, name, dosage, frequency, start_date, instructions, prescribed_by, active) VALUES
('00000000-0000-0000-0000-000000000001', 'Lisinopril', '10mg', 'Once daily', '2024-01-01', 'Take with food, monitor blood pressure', (SELECT id FROM doctors WHERE name = 'Dr. Michael Chen' LIMIT 1), true),
('00000000-0000-0000-0000-000000000001', 'Vitamin D3', '2000 IU', 'Daily', '2024-01-01', 'Take with breakfast', (SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson' LIMIT 1), true)
ON CONFLICT DO NOTHING;

-- Add sample notifications
INSERT INTO notifications (user_id, title, message, type, read) VALUES
('00000000-0000-0000-0000-000000000001', 'Appointment Reminder', 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM', 'info', false),
('00000000-0000-0000-0000-000000000001', 'New Message', 'Dr. Michael Chen has replied to your message', 'info', false),
('00000000-0000-0000-0000-000000000001', 'Prescription Renewal', 'Your Lisinopril prescription is due for renewal in 5 days', 'warning', false)
ON CONFLICT DO NOTHING;

-- Create trigger to update conversation last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_conversation_on_message ON messages;
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();
