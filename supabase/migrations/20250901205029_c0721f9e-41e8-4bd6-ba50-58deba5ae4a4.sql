-- Add some sample doctor profiles for testing
INSERT INTO public.profiles (id, full_name, email, role, avatar_url) VALUES 
  ('f88144f3-6c0f-4a6a-802b-8c2b600979f0', 'Dr. Sarah Johnson', 'dr.sarah@hospital.com', 'doctor', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200'),
  ('a12144f3-6c0f-4a6a-802b-8c2b600979f1', 'Dr. Michael Chen', 'dr.chen@hospital.com', 'doctor', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200'),
  ('b23144f3-6c0f-4a6a-802b-8c2b600979f2', 'Dr. Emily Rodriguez', 'dr.emily@hospital.com', 'doctor', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200');

-- Add some sample messages to the existing conversation
INSERT INTO public.messages (sender_id, receiver_id, content, conversation_id, read, created_at) VALUES 
  ('f88144f3-6c0f-4a6a-802b-8c2b600979f0', 'd452eee6-e3cd-474e-9ec1-a21c6e8de817', 'Hello! I received your consultation request. How can I help you today?', '81c06cd9-c9de-4663-8363-5336272b426d', false, NOW() - INTERVAL '2 hours'),
  ('d452eee6-e3cd-474e-9ec1-a21c6e8de817', 'f88144f3-6c0f-4a6a-802b-8c2b600979f0', 'Hi Dr. Johnson, I have been experiencing headaches for the past week. Could we schedule an appointment?', '81c06cd9-c9de-4663-8363-5336272b426d', true, NOW() - INTERVAL '1 hour'),
  ('f88144f3-6c0f-4a6a-802b-8c2b600979f0', 'd452eee6-e3cd-474e-9ec1-a21c6e8de817', 'Of course! Let me check my availability. Are you experiencing any other symptoms along with the headaches?', '81c06cd9-c9de-4663-8363-5336272b426d', false, NOW() - INTERVAL '30 minutes');

-- Create another conversation between the second user and a different doctor
INSERT INTO public.conversations (id, patient_id, doctor_id, subject, created_at, last_message_at) VALUES 
  ('91c06cd9-c9de-4663-8363-5336272b427e', '5bd007f8-e5fc-4245-a906-ead6e08adc72', 'a12144f3-6c0f-4a6a-802b-8c2b600979f1', 'Cardiac consultation', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour');

INSERT INTO public.messages (sender_id, receiver_id, content, conversation_id, read, created_at) VALUES 
  ('a12144f3-6c0f-4a6a-802b-8c2b600979f1', '5bd007f8-e5fc-4245-a906-ead6e08adc72', 'Hello Samuel! I am Dr. Chen, your cardiologist. I have reviewed your test results and would like to discuss them with you.', '91c06cd9-c9de-4663-8363-5336272b427e', false, NOW() - INTERVAL '2 hours'),
  ('5bd007f8-e5fc-4245-a906-ead6e08adc72', 'a12144f3-6c0f-4a6a-802b-8c2b600979f1', 'Thank you Dr. Chen. I am a bit worried about the results. When would be a good time to discuss them?', '91c06cd9-c9de-4663-8363-5336272b427e', true, NOW() - INTERVAL '1 hour');

-- Update the conversation last_message_at timestamps
UPDATE public.conversations 
SET last_message_at = (
  SELECT MAX(created_at) 
  FROM public.messages 
  WHERE conversation_id = conversations.id
) WHERE id IN ('81c06cd9-c9de-4663-8363-5336272b426d', '91c06cd9-c9de-4663-8363-5336272b427e');