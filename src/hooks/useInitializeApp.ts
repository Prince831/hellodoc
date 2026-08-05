import { useEffect, useState } from 'react';

/**
 * Lightweight app bootstrap. Seeding is no longer performed from the browser —
 * reference data lives in the database and is managed server-side.
 */
export const useInitializeApp = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
      setIsInitializing(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return { isInitialized, isInitializing };
};
