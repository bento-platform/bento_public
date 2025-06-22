import React, { createContext, useContext, ReactNode } from 'react';
import { notification } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { NAVBAR_HEIGHT } from '@/constants/common';

const NOTIFICATION_DISPLACEMENT = NAVBAR_HEIGHT + 24;

const NotificationContext = createContext<NotificationInstance | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification({
    duration: 5,
    showProgress: true,
    pauseOnHover: true,
    top: NOTIFICATION_DISPLACEMENT,
  });

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotify(): NotificationInstance {
  const api = useContext(NotificationContext);
  if (!api) {
    throw new Error('useNotify must be used within a NotificationProvider');
  }
  return api;
}
