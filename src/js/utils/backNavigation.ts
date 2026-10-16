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
type BackEntries = { dataset?: DatasetBackEntry };

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

/** How to get back to where the user entered `dataset` from, if the history still lets us: the origin and # of steps. */
export const getDatasetBackSteps = (dataset: string): { origin: BackOrigin; steps: number } | undefined => {
  const entry = readEntries().dataset;
  if (!entry || entry.dataset !== dataset) return undefined;
  const steps = currentHistoryIdx() - entry.idx;
  return steps > 0 ? { origin: entry.origin, steps } : undefined;
};

/**
 * A history pop is asynchronous: for a moment after calling navigate(-n), the URL still holds the page being left. If the
 * destination scope was already dispatched, ScopedRoute's URL -> scope reconciliation would flip it back to the stale
 * URL's scope (and trigger a round of scope-dependent fetches for it). While a pop is pending, it skips reconciliation.
 */
let backPopPending = false;
let backPopTimeout: ReturnType<typeof setTimeout> | undefined;

export const markBackPopPending = () => {
  backPopPending = true;
  clearTimeout(backPopTimeout);
  backPopTimeout = setTimeout(clearBackPopPending, 1000); // safety net if the pop never lands
};
export const clearBackPopPending = () => {
  backPopPending = false;
  clearTimeout(backPopTimeout);
};
export const isBackPopPending = () => backPopPending;

/**
 * The language switcher only rewrites the current history entry, so popping back to an older entry would revert the
 * language. The scope header's back buttons flag their pop so LanguageHandler restores the user's language
 * (the browser's own back button is left alone).
 */
let keepLanguageOnPop = false;
let keepLanguageTimeout: ReturnType<typeof setTimeout> | undefined;

export const markKeepLanguageOnPop = () => {
  keepLanguageOnPop = true;
  clearTimeout(keepLanguageTimeout);
  keepLanguageTimeout = setTimeout(() => (keepLanguageOnPop = false), 1000); // safety net if the pop never lands
};
export const consumeKeepLanguageOnPop = (): boolean => {
  const flagged = keepLanguageOnPop;
  keepLanguageOnPop = false;
  clearTimeout(keepLanguageTimeout);
  return flagged;
};
