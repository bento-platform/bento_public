/** Extracts a display string from a plain string or labelled object. */
export const getLabel = (v: string | { label: string }) => (typeof v === 'string' ? v : v.label);

/** Normalises study_status values to include an 'UNASSIGNED' value. */
export function normaliseStatus(raw: string | undefined | null): string {
  return raw ?? 'UNASSIGNED';
}

export function facetLabelI18nKey(prefix: string | undefined, value: string) {
  // If we have a defined i18n prefix, try translating the value into a human-readable label.
  // Otherwise, the value will be the label (translated if a key is available).
  return prefix === undefined ? value : prefix + value.toLowerCase();
}
