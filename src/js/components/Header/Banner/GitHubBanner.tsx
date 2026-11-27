import { Suspense, use } from 'react';
import { Alert, Skeleton } from 'antd';
import { announcementsUrl } from '@/constants/configConstants';
import { type AnnouncementResponse } from '@/types/announcements';
import { useLanguage } from '@/hooks';

let announcementPromise: Promise<AnnouncementResponse> | null = null;
const getAnnouncement = (): Promise<AnnouncementResponse> =>
  (announcementPromise ??= fetch(announcementsUrl)
    .then((res) => (res.ok ? (res.json() as Promise<AnnouncementResponse>) : null))
    .catch(() => null));

const AnnouncementAlert = () => {
  const announcement = use(getAnnouncement());
  const language = useLanguage();
  if (!announcement) return null;

  const text = announcement.translations[language] ?? announcement.translations[announcement.defaultLocale];
  if (!text) return null;

  return <Alert title={text.title} description={text.description} type={announcement.type} showIcon banner closable />;
};

export const AnnouncementBanner = () => (
  <div id="site-banner">
    <Suspense fallback={<Skeleton active avatar paragraph={{ rows: 1 }} />}>
      <AnnouncementAlert />
    </Suspense>
  </div>
);
