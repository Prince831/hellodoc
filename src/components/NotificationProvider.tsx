import React from 'react';
import { useNotificationTriggers } from '@/hooks/useNotificationTriggers';

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  // Initialize notification triggers
  useNotificationTriggers();
  
  return <>{children}</>;
};

export default NotificationProvider;