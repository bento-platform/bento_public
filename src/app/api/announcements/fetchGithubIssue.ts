import type { Announcement } from '@/types/announcements';
import { issueToAnnouncement, type GithubIssue } from './parseGithubIssue';

export interface AnnouncementSource {
  repoUrl: string;
  label?: string;
  revalidate?: number; // Seconds Next keeps the GitHub response in its data cache
}

export const defaultLabel = 'announcement';

export const latestIssuesUrl = ({ repoUrl, label = defaultLabel }: AnnouncementSource) => {
  const query = new URLSearchParams({
    labels: label,
    state: 'open',
    sort: 'created',
    direction: 'desc',
    per_page: '1',
  });
  return `${encodeURI(repoUrl)}?${query}`;
};

export const fetchLatestAnnouncement = async (source: AnnouncementSource): Promise<Announcement | null> => {
  const response = await fetch(latestIssuesUrl(source), {
    headers: { Accept: 'application/vnd.github+json' },
    next: { revalidate: source.revalidate },
  });
  if (response.status === 403 || response.status === 429) {
    throw new Error('GitHub rate limit reached');
  }
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`);

  const issues = (await response.json()) as GithubIssue[];
  for (const issue of issues) {
    const announcement = issueToAnnouncement(issue);
    if (announcement) return announcement;
  }
  return null;
};
