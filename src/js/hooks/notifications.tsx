import { createContext, use, type ReactNode } from 'react';
import { notification } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { NAVBAR_HEIGHT } from '@/constants/common';

const NOTIFICATION_DISPLACEMENT = NAVBAR_HEIGHT + 24;

const NotificationContext = createContext<NotificationInstance | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification({
    duration: 5,
    showProgress: true,
    pauseOnHover: true,
    top: NOTIFICATION_DISPLACEMENT,
  });

  return (
    <NotificationContext value={api}>
      {contextHolder}
      {children}
    </NotificationContext>
  );
};

export function useNotify(): NotificationInstance {
  const api = use(NotificationContext);
  if (!api) {
    throw new Error('useNotify must be used within a NotificationProvider');
  }
  return api;
}
