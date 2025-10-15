import React from 'react';
import { Phenopacket } from '@/types/clinPhen/phenopacket';

import SubjectView from './SubjectView';
import BiosampleView from './BiosampleView';
import DiseasesView from './DiseasesView';
import InterpretationsView from './InterpretationsView';
import MeasurementsView from './MeasurementsView';
import MedicalActionsView from './MedicalActionsView';
import PhenotypicFeaturesView from './PhenotypicFeaturesView';

export type SectionKey =
  | 'subject'
  | 'biosamples'
  | 'diseases'
  | 'interpretations'
  | 'measurements'
  | 'medicalActions'
  | 'phenotypicFeatures';

export type SectionSpec = {
  /** human label */
  title: string;
  /** which column to render in (0/1); extend as needed */
  column: 0 | 1;
  /** should this section render? can be a boolean or predicate fn */
  enabled: boolean | ((p: Phenopacket) => boolean);
  /** content renderer; gets the whole phenopacket so it’s easy to change later */
  render: (p: Phenopacket) => React.ReactNode;
  /** order within the column */
  order?: number;
};

// default helpers you can reuse in other registries
const has = <T,>(x?: T[] | null) => Array.isArray(x) && x.length > 0;

export const sectionSpecs: Record<SectionKey, SectionSpec> = {
  subject: {
    title: 'Subject',
    column: 0,
    enabled: (p) => !!p.subject,
    render: (p) => {
      const s = p.subject!;
      const { id, time_at_last_encounter, karyotypic_sex, extra_properties } = s;
      return <SubjectView subject={{ id, time_at_last_encounter, karyotypic_sex, extra_properties }} tiny />;
    },
    order: 0,
  },
  biosamples: {
    title: 'Biosamples',
    column: 0,
    enabled: (p) => has(p.biosamples),
    render: (p) => <BiosampleView biosamples={p.biosamples!} />,
    order: 1,
  },
  diseases: {
    title: 'Diseases',
    column: 0,
    enabled: (p) => has(p.diseases),
    render: (p) => <DiseasesView diseases={p.diseases!} />,
    order: 2,
  },
  interpretations: {
    title: 'Interpretations',
    column: 1,
    enabled: (p) => has(p.interpretations),
    render: (p) => <InterpretationsView interpretations={p.interpretations!} />,
    order: 0,
  },
  measurements: {
    title: 'Measurements',
    column: 1,
    enabled: (p) => has(p.measurements),
    render: (p) => <MeasurementsView measurements={p.measurements!} />,
    order: 1,
  },
  medicalActions: {
    title: 'Medical Actions',
    column: 1,
    enabled: (p) => has(p.medical_actions),
    render: (p) => <MedicalActionsView medicalActions={p.medical_actions!} />,
    order: 2,
  },
  phenotypicFeatures: {
    title: 'Phenotypic Features',
    column: 1,
    enabled: (p) => has(p.phenotypic_features),
    render: (p) => <PhenotypicFeaturesView features={p.phenotypic_features!} />,
    order: 3,
  },
};
