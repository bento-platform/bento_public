/** Extracts a display string from a plain string or labelled object. */
export const getLabel = (v: string | { label: string }) => (typeof v === 'string' ? v : v.label);

/** Normalises raw study_status values to display strings. */
export function normaliseStatus(raw: string | undefined | null): string {
  if (raw === 'ONGOING') return 'Ongoing';
  if (raw === 'COMPLETED') return 'Completed';
  return 'Unassigned';
}
