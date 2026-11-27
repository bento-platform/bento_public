import { BANNER_CACHE_LIFE, BANNER_REPO } from '@/env.server';
import type { AnnouncementResponse } from '@/types/announcements';
import { fetchLatestAnnouncement } from './fetchGithubIssue';

// TODO: remove before merge; only here for testing.
const TEST_REPO = 'https://api.github.com/repos/Pan-Canadian-Genome-Library/pcgl-common-react-components/issues';

export async function GET() {
  const repoUrl = BANNER_REPO || TEST_REPO;

  let body: AnnouncementResponse = null;
  try {
    body = await fetchLatestAnnouncement({ repoUrl, revalidate: BANNER_CACHE_LIFE });
  } catch (err) {
    console.error('Error fetching announcement', err);
  }

  return Response.json(body, { headers: { 'Cache-Control': `public, max-age=${BANNER_CACHE_LIFE}` } });
}
