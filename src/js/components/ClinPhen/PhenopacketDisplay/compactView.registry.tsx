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
  /** should this section render? can be a boolean or predicate fn */
  enabled: boolean | ((p: Phenopacket) => boolean);
  /** content renderer; gets the whole phenopacket so it’s easy to change later */
  render: (p: Phenopacket) => React.ReactNode;
  /** order within the column */
  order?: number;
};

const has = <T,>(x?: T[] | null) => Array.isArray(x) && x.length > 0;

export const sectionSpecs: Record<SectionKey, SectionSpec> = {
  subject: {
    title: 'Subject',
    enabled: (p) => !!p.subject,
    render: (p) => {
      const s = p.subject!;
      return <SubjectView subject={s} />;
    },
    order: 0,
  },
  biosamples: {
    title: 'Biosamples',
    enabled: (p) => has(p.biosamples),
    render: (p) => <BiosampleView biosamples={p.biosamples!} />,
    order: 1,
  },
  diseases: {
    title: 'Diseases',
    enabled: (p) => has(p.diseases),
    render: (p) => <DiseasesView diseases={p.diseases!} />,
    order: 2,
  },
  interpretations: {
    title: 'Interpretations',
    enabled: (p) => has(p.interpretations),
    render: (p) => <InterpretationsView interpretations={p.interpretations!} />,
    order: 3,
  },
  measurements: {
    title: 'Measurements',
    enabled: (p) => has(p.measurements),
    render: (p) => <MeasurementsView measurements={p.measurements!} />,
    order: 4,
  },
  medicalActions: {
    title: 'Medical Actions',
    enabled: (p) => has(p.medical_actions),
    render: (p) => <MedicalActionsView medicalActions={p.medical_actions!} />,
    order: 5,
  },
  phenotypicFeatures: {
    title: 'Phenotypic Features',
    enabled: (p) => has(p.phenotypic_features),
    render: (p) => <PhenotypicFeaturesView features={p.phenotypic_features!} />,
    order: 6,
  },
};
