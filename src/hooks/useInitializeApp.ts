import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { seedDoctors } from '@/scripts/seedDoctors';
import { useToast } from '@/hooks/use-toast';

export const useInitializeApp = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Check if doctors exist in the database
        const { data: existingDoctors, error } = await supabase
          .from('doctors')
          .select('id')
          .limit(1);

        if (error) {
          console.error('Error checking for existing doctors:', error);
          throw error;
        }

        // If no doctors exist, seed the database
        if (!existingDoctors || existingDoctors.length === 0) {
          console.log('No doctors found, seeding database...');
          await seedDoctors();
          
          toast({
            title: "Database Initialized",
            description: "Sample doctors have been added to the platform.",
          });
        } else {
          console.log('Doctors already exist in database');
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize the app. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [toast]);

  return { isInitialized, isInitializing };
};
