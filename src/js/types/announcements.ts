export type AnnouncementType = 'success' | 'info' | 'warning' | 'error';

export interface AnnouncementText {
  title: string;
  description: string;
}

export interface Announcement {
  id: string;
  type: AnnouncementType;
  defaultLocale: string;
  translations: Record<string, AnnouncementText>;
}

export type AnnouncementResponse = Announcement | null;
