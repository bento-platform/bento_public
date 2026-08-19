import type { StringOrOntologyClass } from '@/types/dataset';
import { ontologyCurie, ontologyLabel } from './helpers';

export const OntologyChip = ({ item, variant }: { item: StringOrOntologyClass; variant: 'kw' | 'taxa' | 'dom' }) => {
  const curie = ontologyCurie(item);
  return (
    <span className={`pm-chip pm-chip-${variant}`}>
      {ontologyLabel(item)}
      {curie && <span className="pm-chip-curie">{curie}</span>}
    </span>
  );
};
