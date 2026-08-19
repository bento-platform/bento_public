import type { ReactNode } from 'react';

export type SectionId =
  | 'summary'
  | 'links'
  | 'primary_contact'
  | 'stakeholders'
  | 'publications'
  | 'funding'
  | 'access'
  | 'spatial'
  | 'criteria'
  | 'counts'
  | 'identifiers';

export type ProvenanceEntry = { id: SectionId; icon: ReactNode; count?: number; children?: ReactNode };
