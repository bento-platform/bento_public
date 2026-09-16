import type { HexColor } from 'bento-charts';
import { PALETTE, type FacetId } from '@/features/catalogue/constants';
import type { NamespaceTranslationFunction } from '@/types/translation';

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

/** Sentinel facet/filter value for datasets with no study_status. Unlike a real status, this is
 *  synthesised client-side (the backend never returns it), so it's translated for display via
 *  `provenance.status.unassigned` wherever it's shown, rather than rendered as-is. */
export const UNASSIGNED_STATUS = '__unassigned__';

/** Normalises study_status values to the {@link UNASSIGNED_STATUS} sentinel when absent. */
export function normaliseStatus(raw: string | undefined | null): string {
  return raw ?? UNASSIGNED_STATUS;
}

export type StatusVariant = 'ongoing' | 'completed' | 'unassigned' | 'other';

/**
 * Classifies a (backend-translated) study_status value for badge/chart colouring, by comparing it
 * against this UI's own translations of the known statuses. Case-insensitive, since the backend's
 * translated casing (e.g. all-caps enum-style text) doesn't necessarily match this UI's own. Anything
 * else - including a custom status the frontend doesn't recognise - falls back to 'other' rather than
 * being miscoloured.
 */
export function getStatusVariant(status: string | undefined | null, t: NamespaceTranslationFunction): StatusVariant {
  if (!status || status === UNASSIGNED_STATUS) return 'unassigned';
  const normalised = status.toLowerCase();
  if (normalised === t('provenance.status.ongoing').toLowerCase()) return 'ongoing';
  if (normalised === t('provenance.status.completed').toLowerCase()) return 'completed';
  return 'other';
}

/** Builds the i18n key for a facet's label, e.g., "domains" -> "catalogue.facets.domains". */
export const facetTranslationKey = (facet: FacetId): string => `catalogue.facets.${facet}`;
