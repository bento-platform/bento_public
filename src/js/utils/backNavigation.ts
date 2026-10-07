import type { BackOrigin } from '@/types/navigation';

/**
 * "Back" buttons that behave like the browser's: rather than navigating to a fresh URL (which loses the search terms /
 * filters of the page the user left), we remember which history entry the user left from, and pop back to it.
 *
 * We track the *history index* (react-router stamps `history.state.idx` on every entry) rather than putting state on
 * the destination's location, since location state is dropped by any later navigation that doesn't explicitly carry it
 * over - which includes most of the search form's navigations (filters, text search, table paging, ...). Counting
 * entries is immune to however many pushes/replaces happen in between.
 *
 * Records live in sessionStorage so they survive a page reload (history entries do too), but are discarded when the
 * document is freshly loaded some other way (typed URL, external link, auth redirect), as they'd then be stale.
 */

const STORAGE_KEY = 'bento:backEntries';

type DatasetBackEntry = { idx: number; origin: BackOrigin; dataset: string };
type BackEntries = { dataset?: DatasetBackEntry; explore?: { idx: number } };

const isBrowser = () => typeof window !== 'undefined';

const readEntries = (): BackEntries => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as BackEntries;
  } catch {
    return {};
  }
};

const writeEntries = (entries: BackEntries) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // sessionStorage unavailable - back buttons just fall back to their default destinations.
  }
};

if (isBrowser()) {
  const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type;
  if (navType === 'navigate' || navType === 'prerender') {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

/** The index of the current history entry, as stamped by react-router. */
export const currentHistoryIdx = (): number => (isBrowser() ? ((window.history.state?.idx as number) ?? 0) : 0);

/** Call just before navigating into a dataset from one of its cards, while the origin page is still current. */
export const recordDatasetBackEntry = (origin: BackOrigin, dataset: string) =>
  writeEntries({ ...readEntries(), dataset: { idx: currentHistoryIdx(), origin, dataset } });

/** Call just before navigating from an Explore page to a phenopacket view, while Explore is still current. */
export const recordExploreBackEntry = () => writeEntries({ ...readEntries(), explore: { idx: currentHistoryIdx() } });

/** How to get back to where the user entered `dataset` from, if the history still lets us: the origin and # of steps. */
export const getDatasetBackSteps = (dataset: string): { origin: BackOrigin; steps: number } | undefined => {
  const entry = readEntries().dataset;
  if (!entry || entry.dataset !== dataset) return undefined;
  const steps = currentHistoryIdx() - entry.idx;
  return steps > 0 ? { origin: entry.origin, steps } : undefined;
};

/** How many steps back the Explore page the user entered a phenopacket view from is, if the history still has it. */
export const getExploreBackSteps = (): number | undefined => {
  const entry = readEntries().explore;
  const steps = entry ? currentHistoryIdx() - entry.idx : 0;
  return steps > 0 ? steps : undefined;
};
