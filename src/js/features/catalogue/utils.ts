import type { HexColor } from 'bento-charts';
import type { FacetId } from '@/features/catalogue/constants';
import type { StudyContext } from '@/types/dataset';

/** Ordered colour palette used to assign a stable colour per project name. */
export const PALETTE: HexColor[] = ['#1677FF', '#13C2C2', '#722ED1', '#FA8C16', '#52C41A'];

/**
 * Assigns a deterministic colour from {@link PALETTE} to each project name.
 * Names are sorted alphabetically before assignment so order is stable across renders.
 */
export function assignColors(names: string[]): Record<string, HexColor> {
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  return Object.fromEntries(sorted.map((name, i) => [name, PALETTE[i % PALETTE.length]]));
}

/** Extracts a display string from a plain string or labelled object. */
export const getLabel = (v: string | { label: string }) => (typeof v === 'string' ? v : v.label);

/** Normalises study_status values to include an 'UNASSIGNED' value. */
export function normaliseStatus(raw: string | undefined | null): string {
  return raw ?? 'UNASSIGNED';
}

/** Builds the i18n key for a normalised status value, e.g., "Unassigned" -> "provenance.status.unassigned". */
export const statusTranslationKey = (status: string): string => `provenance.status.${status.toLowerCase()}`;

/** Builds the i18n key for a normalised study context value, e.g., "Clinical" -> "provenance.context.clinical". */
export const studyContextTranslationKey = (context: StudyContext): string =>
  `provenance.context.${context.toLowerCase()}`;

/** Builds the i18n key for a facet's label, e.g., "domains" -> "catalogue.facets.domains". */
export const facetTranslationKey = (facet: FacetId): string => `catalogue.facets.${facet}`;

/** Builds the i18n key for a facet's value, .e.g, "COMPLETED" -> "Completed" | "Complété" */
export function facetValueTranslationKey(prefix: string | undefined, value: string) {
  // If we have a defined i18n prefix, try translating the value into a human-readable label.
  // Otherwise, the value will be the label (translated if a key is available).
  return prefix === undefined ? value : prefix + value.toLowerCase();
}
