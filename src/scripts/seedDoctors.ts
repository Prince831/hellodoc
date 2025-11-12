// Script to seed initial doctors data into Supabase
// This can be run once to populate the database

import { supabase } from "@/integrations/supabase/client";

export const seedDoctors = async () => {
  const doctors = [
    {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      keywords: ['heart', 'chest', 'cardiac', 'blood pressure', 'cardiovascular'],
      rating: 4.8,
      years_of_experience: 15,
      availability: true,
      image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@hospital.com',
      bio: 'Experienced cardiologist specializing in heart disease prevention and treatment with over 15 years of clinical experience.',
      education: 'MD from Harvard Medical School, Residency at Mayo Clinic',
      languages: ['English', 'Spanish'],
      hospital: 'City General Hospital',
      license_number: 'MD12345',
      clinic_address: '123 Medical Ave, City, ST 12345',
      consultation_types: ['In-person', 'Video'],
      consultation_fee: 200,
      working_hours: {
        monday: '9:00-17:00',
        tuesday: '9:00-17:00',
        wednesday: '9:00-17:00',
        thursday: '9:00-17:00',
        friday: '9:00-17:00'
      }
    },
    {
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      keywords: ['headache', 'migraine', 'neurological', 'brain', 'nervous system'],
      rating: 4.9,
      years_of_experience: 12,
      availability: true,
      image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
      phone: '(555) 234-5678',
      email: 'michael.chen@hospital.com',
      bio: 'Neurologist with expertise in migraine treatment, brain disorders, and comprehensive neurological care.',
      education: 'MD from Johns Hopkins University, Fellowship in Neurology',
      languages: ['English', 'Mandarin'],
      hospital: 'Metro Medical Center',
      license_number: 'MD67890',
      clinic_address: '456 Health St, City, ST 12345',
      consultation_types: ['In-person', 'Video'],
      consultation_fee: 250,
      working_hours: {
        monday: '8:00-16:00',
        tuesday: '8:00-16:00',
        wednesday: '8:00-16:00',
        thursday: '8:00-16:00',
        friday: '8:00-16:00'
      }
    },
    {
      name: 'Dr. Emily Watson',
      specialization: 'Dermatology',
      keywords: ['skin', 'rash', 'dermal', 'acne', 'cosmetic'],
      rating: 4.7,
      years_of_experience: 10,
      availability: true,
      image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200',
      phone: '(555) 345-6789',
      email: 'emily.watson@clinic.com',
      bio: 'Dermatologist specializing in skin conditions, cosmetic procedures, and advanced dermatological treatments.',
      education: 'MD from Stanford Medical School, Dermatology Residency',
      languages: ['English', 'French'],
      hospital: 'Sunshine Clinic',
      license_number: 'MD11111',
      clinic_address: '789 Wellness Blvd, City, ST 12345',
      consultation_types: ['In-person', 'Video'],
      consultation_fee: 180,
      working_hours: {
        monday: '10:00-18:00',
        tuesday: '10:00-18:00',
        wednesday: '10:00-18:00',
        thursday: '10:00-18:00',
        friday: '10:00-18:00'
      }
    },
    {
      name: 'Dr. James Wilson',
      specialization: 'General Medicine',
      keywords: ['fever', 'cold', 'flu', 'general', 'primary care'],
      rating: 4.6,
      years_of_experience: 20,
      availability: true,
      image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200',
      phone: '(555) 456-7890',
      email: 'james.wilson@familyhealth.com',
      bio: 'General practitioner with extensive experience in family medicine and primary care for all ages.',
      education: 'MD from University of California, Family Medicine Residency',
      languages: ['English'],
      hospital: 'Family Health Center',
      license_number: 'MD22222',
      clinic_address: '321 Care Ave, City, ST 12345',
      consultation_types: ['In-person', 'Video'],
      consultation_fee: 150,
      working_hours: {
        monday: '7:00-19:00',
        tuesday: '7:00-19:00',
        wednesday: '7:00-19:00',
        thursday: '7:00-19:00',
        friday: '7:00-19:00'
      }
    },
    {
      name: 'Dr. Aisha Patel',
      specialization: 'Pediatrics',
      keywords: ['children', 'pediatric', 'infant', 'adolescent', 'vaccine'],
      rating: 4.9,
      years_of_experience: 14,
      availability: true,
      image_url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=200',
      phone: '(555) 567-8901',
      email: 'aisha.patel@childrenshospital.com',
      bio: 'Pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence.',
      education: 'MD from Columbia University, Pediatrics Residency at Children\'s Hospital',
      languages: ['English', 'Hindi', 'Gujarati'],
      hospital: 'Children\'s Hospital',
      license_number: 'MD33333',
      clinic_address: '555 Kids Lane, City, ST 12345',
      consultation_types: ['In-person', 'Video'],
      consultation_fee: 175,
      working_hours: {
        monday: '8:00-17:00',
        tuesday: '8:00-17:00',
        wednesday: '8:00-17:00',
        thursday: '8:00-17:00',
        friday: '8:00-15:00'
      }
    }
  ];

  try {
    console.log('Seeding doctors...');
    
    const { data, error } = await supabase
      .from('doctors')
      .insert(doctors)
      .select();

    if (error) {
      console.error('Error seeding doctors:', error);
      throw error;
    }

    console.log('Doctors seeded successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to seed doctors:', error);
    throw error;
  }
};
