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
  /** translation title label */
  titleTranslationKey: string;
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
    titleTranslationKey: 'subject.subject',
    enabled: (p) => !!p.subject,
    render: (p) => {
      const s = p.subject!;
      return <SubjectView subject={s} />;
    },
    order: 0,
  },
  biosamples: {
    titleTranslationKey: 'entities.biosample_other',
    enabled: (p) => has(p.biosamples),
    render: (p) => <BiosampleView biosamples={p.biosamples!} />,
    order: 1,
  },
  diseases: {
    titleTranslationKey: 'tab_keys.diseases',
    enabled: (p) => has(p.diseases),
    render: (p) => <DiseasesView diseases={p.diseases!} />,
    order: 2,
  },
  interpretations: {
    titleTranslationKey: 'tab_keys.diseases',
    enabled: (p) => has(p.interpretations),
    render: (p) => <InterpretationsView interpretations={p.interpretations!} />,
    order: 3,
  },
  measurements: {
    titleTranslationKey: 'tab_keys.measurements',
    enabled: (p) => has(p.measurements),
    render: (p) => <MeasurementsView measurements={p.measurements!} />,
    order: 4,
  },
  medicalActions: {
    titleTranslationKey: 'tab_keys.medical_actions',
    enabled: (p) => has(p.medical_actions),
    render: (p) => <MedicalActionsView medicalActions={p.medical_actions!} />,
    order: 5,
  },
  phenotypicFeatures: {
    titleTranslationKey: 'tab_keys.phenotypic_features',
    enabled: (p) => has(p.phenotypic_features),
    render: (p) => <PhenotypicFeaturesView features={p.phenotypic_features!} />,
    order: 6,
  },
};
