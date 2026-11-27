/**
 * taken from: https://github.com/Pan-Canadian-Genome-Library/pcgl-common-react-components/blob/main/packages/announcements/README.md
 */

import type { Announcement, AnnouncementType } from '@/types/announcements';

export interface GithubIssue {
  number: number;
  title: string;
  body: string | null;
  author_association: string;
  pull_request?: unknown;
}

export const fields = {
  type: 'Announcement type',
  enDescription: 'Description (EN)',
  frTitle: 'Title (FR)',
  frDescription: 'Description (FR)',
} as const;

const trustedAuthors = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

const announcementTypes = new Set<string>(['success', 'info', 'warning', 'error']);

const titlePrefix = /^\[Announcement\]:\s*/i;

const readSections = (body: string): Map<string, string> => {
  const sections = new Map<string, string>();
  const parts = body.replace(/\r\n/g, '\n').split(/^### /m).slice(1);
  for (const part of parts) {
    const newline = part.indexOf('\n');
    const label = (newline === -1 ? part : part.slice(0, newline)).trim();
    const value = newline === -1 ? '' : part.slice(newline + 1).trim();
    sections.set(label, value === '_No response_' ? '' : value);
  }
  return sections;
};

export const issueToAnnouncement = (issue: GithubIssue): Announcement | null => {
  if (issue.pull_request || !trustedAuthors.has(issue.author_association)) return null;

  const sections = readSections(issue.body ?? '');
  const type = sections.get(fields.type) ?? '';
  const enTitle = issue.title.replace(titlePrefix, '').trim();
  const enDescription = sections.get(fields.enDescription) ?? '';
  if (!announcementTypes.has(type) || !enTitle || !enDescription) return null;

  const translations: Announcement['translations'] = {
    en: { title: enTitle, description: enDescription },
  };
  const frTitle = sections.get(fields.frTitle) ?? '';
  const frDescription = sections.get(fields.frDescription) ?? '';
  if (frTitle && frDescription) translations.fr = { title: frTitle, description: frDescription };

  return {
    id: String(issue.number),
    type: type as AnnouncementType,
    defaultLocale: 'en',
    translations,
  };
};
