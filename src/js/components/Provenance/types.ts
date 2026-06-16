import type { ReactNode } from 'react';

export type SectionId =
  | 'summary'
  | 'links'
  | 'contact'
  | 'stakeholders'
  | 'publications'
  | 'funding'
  | 'access'
  | 'spatial'
  | 'criteria'
  | 'counts'
  | 'identifiers';

export type NavEntry = { id: SectionId; label: string; icon: ReactNode; count?: number };
