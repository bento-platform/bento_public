import { PUBLIC_URL_NO_TRAILING_SLASH } from '@/config';

// Absolute (rather than root-relative) so this also resolves when fetched from a Node context (e.g. SSR), where
// there's no implicit browser origin to resolve a relative URL against.
export const partialAboutUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/public`;
