import OntologyTerm from './OntologyTerm';
import TimeElementDisplay from './TimeElementDisplay';
import TDescriptions from '../TDescriptions';

import type { Procedure as ProcedureType } from '@/types/clinPhen/procedure';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

const Procedure = ({ procedure: p }: { procedure: ProcedureType | undefined }) => {
  if (!p) return null;
  const items: ConditionalDescriptionItem[] = [
    {
      key: 'code',
      label: 'clinphen_generic.code',
      children: <OntologyTerm term={p.code} />,
    },
    {
      key: 'body_site',
      label: 'biosample_expanded_row.body_site',
      children: <OntologyTerm term={p?.body_site} />,
    },
    {
      key: 'performed',
      label: 'biosample_expanded_row.performed',
      children: <TimeElementDisplay element={p?.performed} />,
    },
  ];
  return <TDescriptions items={items} size="compact" />;
};

export default Procedure;
