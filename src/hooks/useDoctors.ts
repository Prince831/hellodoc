
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/types/doctor";

export const useDoctors = (specialization?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ['doctors', specialization, searchTerm],
    queryFn: async () => {
      console.log('Using mock doctors data for patient-only system');
      
      // Mock doctors data since we removed the doctors table
      const mockDoctors: Doctor[] = [
        {
          id: 'd1',
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiology',
          keywords: ['heart', 'chest', 'cardiac', 'blood pressure'],
          rating: 4.8,
          years_of_experience: 15,
          availability: true,
          image_url: '/doctor-placeholder.jpg',
          phone: '(555) 123-4567',
          email: 'sarah@clinic.com',
          bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
          education: 'MD from Harvard Medical School',
          languages: ['English', 'Spanish'],
          hospital: 'City General Hospital',
          license_number: 'MD12345',
          clinic_address: '123 Medical Ave, City, ST 12345',
          consultation_types: ['In-person', 'Video'],
          consultation_fee: 200,
          working_hours: { monday: '9:00-17:00', tuesday: '9:00-17:00', wednesday: '9:00-17:00', thursday: '9:00-17:00', friday: '9:00-17:00' },
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'd2',
          name: 'Dr. Michael Chen',
          specialization: 'Neurology',
          keywords: ['headache', 'migraine', 'neurological', 'brain'],
          rating: 4.9,
          years_of_experience: 12,
          availability: true,
          image_url: '/doctor-placeholder.jpg',
          phone: '(555) 234-5678',
          email: 'michael@clinic.com',
          bio: 'Neurologist with expertise in migraine treatment and brain disorders.',
          education: 'MD from Johns Hopkins University',
          languages: ['English', 'Mandarin'],
          hospital: 'Metro Medical Center',
          license_number: 'MD67890',
          clinic_address: '456 Health St, City, ST 12345',
          consultation_types: ['In-person', 'Video'],
          consultation_fee: 250,
          working_hours: { monday: '8:00-16:00', tuesday: '8:00-16:00', wednesday: '8:00-16:00', thursday: '8:00-16:00', friday: '8:00-16:00' },
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'd3',
          name: 'Dr. Emily Watson',
          specialization: 'Dermatology',
          keywords: ['skin', 'rash', 'dermal', 'acne'],
          rating: 4.7,
          years_of_experience: 10,
          availability: true,
          image_url: '/doctor-placeholder.jpg',
          phone: '(555) 345-6789',
          email: 'emily@clinic.com',
          bio: 'Dermatologist specializing in skin conditions and cosmetic procedures.',
          education: 'MD from Stanford Medical School',
          languages: ['English', 'French'],
          hospital: 'Sunshine Clinic',
          license_number: 'MD11111',
          clinic_address: '789 Wellness Blvd, City, ST 12345',
          consultation_types: ['In-person', 'Video'],
          consultation_fee: 180,
          working_hours: { monday: '10:00-18:00', tuesday: '10:00-18:00', wednesday: '10:00-18:00', thursday: '10:00-18:00', friday: '10:00-18:00' },
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'd4',
          name: 'Dr. James Wilson',
          specialization: 'General Medicine',
          keywords: ['fever', 'cold', 'flu', 'general'],
          rating: 4.6,
          years_of_experience: 20,
          availability: true,
          image_url: '/doctor-placeholder.jpg',
          phone: '(555) 456-7890',
          email: 'james@clinic.com',
          bio: 'General practitioner with extensive experience in family medicine.',
          education: 'MD from University of California',
          languages: ['English'],
          hospital: 'Family Health Center',
          license_number: 'MD22222',
          clinic_address: '321 Care Ave, City, ST 12345',
          consultation_types: ['In-person', 'Video'],
          consultation_fee: 150,
          working_hours: { monday: '7:00-19:00', tuesday: '7:00-19:00', wednesday: '7:00-19:00', thursday: '7:00-19:00', friday: '7:00-19:00' },
          created_at: '2023-01-01T00:00:00Z'
        }
      ];

      let filteredDoctors = [...mockDoctors];

      if (specialization) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
        );
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.name.toLowerCase().includes(searchLower) ||
          doctor.specialization.toLowerCase().includes(searchLower)
        );
      }

      console.log('Filtered mock doctors:', filteredDoctors);
      return filteredDoctors;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      console.log('Fetching mock doctor with ID:', doctorId);
      
      // Use the same mock data as above
      const mockDoctors: Doctor[] = [
        {
          id: 'd1',
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiology',
          keywords: ['heart', 'chest', 'cardiac', 'blood pressure'],
          rating: 4.8,
          years_of_experience: 15,
          availability: true,
          image_url: '/doctor-placeholder.jpg',
          phone: '(555) 123-4567',
          email: 'sarah@clinic.com',
          bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
          education: 'MD from Harvard Medical School',
          languages: ['English', 'Spanish'],
          hospital: 'City General Hospital',
          license_number: 'MD12345',
          clinic_address: '123 Medical Ave, City, ST 12345',
          consultation_types: ['In-person', 'Video'],
          consultation_fee: 200,
          working_hours: { monday: '9:00-17:00', tuesday: '9:00-17:00', wednesday: '9:00-17:00', thursday: '9:00-17:00', friday: '9:00-17:00' },
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'd2',
          name: 'Dr. Michael Chen',
          specialization: 'Neurology',
          keywords: ['headache', 'migraine', 'neurological', 'brain'],
          rating: 4.9,
          years_of_experience: 12,
          availability: true,
          image_url: '/doctor-placeholder.jpg',
          phone: '(555) 234-5678',
          email: 'michael@clinic.com',
          bio: 'Neurologist with expertise in migraine treatment and brain disorders.',
          education: 'MD from Johns Hopkins University',
          languages: ['English', 'Mandarin'],
          hospital: 'Metro Medical Center',
          license_number: 'MD67890',
          clinic_address: '456 Health St, City, ST 12345',
          consultation_types: ['In-person', 'Video'],
          consultation_fee: 250,
          working_hours: { monday: '8:00-16:00', tuesday: '8:00-16:00', wednesday: '8:00-16:00', thursday: '8:00-16:00', friday: '8:00-16:00' },
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'd3',
          name: 'Dr. Emily Watson',
          specialization: 'Dermatology',
          keywords: ['skin', 'rash', 'dermal', 'acne'],
          rating: 4.7,
          years_of_experience: 10,
          availability: true,
          image_url: '/doctor-placeholder.jpg',
          phone: '(555) 345-6789',
          email: 'emily@clinic.com',
          bio: 'Dermatologist specializing in skin conditions and cosmetic procedures.',
          education: 'MD from Stanford Medical School',
          languages: ['English', 'French'],
          hospital: 'Sunshine Clinic',
          license_number: 'MD11111',
          clinic_address: '789 Wellness Blvd, City, ST 12345',
          consultation_types: ['In-person', 'Video'],
          consultation_fee: 180,
          working_hours: { monday: '10:00-18:00', tuesday: '10:00-18:00', wednesday: '10:00-18:00', thursday: '10:00-18:00', friday: '10:00-18:00' },
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 'd4',
          name: 'Dr. James Wilson',
          specialization: 'General Medicine',
          keywords: ['fever', 'cold', 'flu', 'general'],
          rating: 4.6,
          years_of_experience: 20,
          availability: true,
          image_url: '/doctor-placeholder.jpg',
          phone: '(555) 456-7890',
          email: 'james@clinic.com',
          bio: 'General practitioner with extensive experience in family medicine.',
          education: 'MD from University of California',
          languages: ['English'],
          hospital: 'Family Health Center',
          license_number: 'MD22222',
          clinic_address: '321 Care Ave, City, ST 12345',
          consultation_types: ['In-person', 'Video'],
          consultation_fee: 150,
          working_hours: { monday: '7:00-19:00', tuesday: '7:00-19:00', wednesday: '7:00-19:00', thursday: '7:00-19:00', friday: '7:00-19:00' },
          created_at: '2023-01-01T00:00:00Z'
        }
      ];

      const doctor = mockDoctors.find(d => d.id === doctorId);
      if (!doctor) {
        throw new Error(`Doctor with ID ${doctorId} not found`);
      }

      console.log('Found mock doctor:', doctor);
      return doctor;
    },
    enabled: !!doctorId,
  });
};
