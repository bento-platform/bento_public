import type { ReactNode } from 'react';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { Biosample } from '@/types/clinPhen/biosample';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';

import SubjectView from './SubjectView';
import BiosampleView from './BiosampleView';
import DiseasesView from './DiseasesView';
import InterpretationsView from './InterpretationsView';
import MeasurementsView from './MeasurementsView';
import MedicalActionsView from './MedicalActionsView';
import PhenotypicFeaturesView from './PhenotypicFeaturesView';

import ExperimentView from '@/components/ClinPhen/ExperimentDisplay/ExperimentView';
import ExperimentResultView from '@/components/ClinPhen/ExperimentDisplay/ExperimentResultView';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';

import { objectToBoolean } from '@/utils/boolean';

export type SectionKey =
  | 'subject'
  | 'biosamples'
  | 'diseases'
  | 'interpretations'
  | 'measurements'
  | 'medicalActions'
  | 'phenotypicFeatures'
  | 'experiments'
  | 'experimentResults'
  | 'extraProperties';

export type SectionSpec = {
  /** translation title label */
  titleTranslationKey: string;
  /** list item count (optional) */
  itemCount?: (p: Phenopacket) => number | undefined;
  /** should this section render? can be a boolean or predicate fn */
  enabled: boolean | ((p: Phenopacket) => boolean);
  /** content renderer; gets the whole phenopacket so it’s easy to change later */
  render: (p: Phenopacket) => ReactNode;
  /** order within the column */
  order?: number;
};

const has = <T,>(x?: T[] | null) => Array.isArray(x) && x.length > 0;

const phenopacketExperiments = (p: Phenopacket): Experiment[] =>
  (p.biosamples ?? []).flatMap((b: Biosample) => b?.experiments ?? []);

const phenopacketExperimentResults = (p: Phenopacket): ExperimentResult[] => {
  const experimentResults: Record<number, ExperimentResult> = {};

  phenopacketExperiments(p).forEach((e: Experiment) => {
    (e.experiment_results ?? []).forEach((er: ExperimentResult) => {
      if (!(er.id in experimentResults)) {
        experimentResults[er.id] = { ...er, experiments: [] };
      }
      experimentResults[er.id].experiments?.push(e.id);
    });
  });

  return Object.values(experimentResults);
};

export const SECTION_SPECS: Record<SectionKey, SectionSpec> = {
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
    itemCount: (p) => p.biosamples?.length,
    render: (p) => <BiosampleView biosamples={p.biosamples!} />,
    order: 1,
  },
  diseases: {
    titleTranslationKey: 'tab_keys.diseases',
    itemCount: (p) => p.diseases?.length,
    enabled: (p) => has(p.diseases),
    render: (p) => <DiseasesView diseases={p.diseases!} />,
    order: 2,
  },
  interpretations: {
    titleTranslationKey: 'tab_keys.interpretations',
    itemCount: (p) => p.interpretations?.length,
    enabled: (p) => has(p.interpretations),
    render: (p) => <InterpretationsView interpretations={p.interpretations!} />,
    order: 3,
  },
  measurements: {
    titleTranslationKey: 'tab_keys.measurements',
    enabled: (p) => has(p.measurements),
    itemCount: (p) => p.measurements?.length,
    render: (p) => <MeasurementsView measurements={p.measurements!} />,
    order: 4,
  },
  medicalActions: {
    titleTranslationKey: 'tab_keys.medical_actions',
    enabled: (p) => has(p.medical_actions),
    itemCount: (p) => p.medical_actions?.length,
    render: (p) => <MedicalActionsView medicalActions={p.medical_actions!} />,
    order: 5,
  },
  phenotypicFeatures: {
    titleTranslationKey: 'tab_keys.phenotypic_features',
    enabled: (p) => has(p.phenotypic_features),
    itemCount: (p) => p.phenotypic_features?.length,
    render: (p) => <PhenotypicFeaturesView features={p.phenotypic_features!} />,
    order: 6,
  },
  experiments: {
    titleTranslationKey: 'entities.experiment_other',
    enabled: (p) => has(phenopacketExperiments(p)),
    itemCount: (p) => phenopacketExperiments(p).length,
    render: (p) => <ExperimentView packetId={p.id} experiments={phenopacketExperiments(p)} />,
    order: 7,
  },
  experimentResults: {
    titleTranslationKey: 'entities.experiment_result_other',
    enabled: (p) => has(phenopacketExperimentResults(p)),
    itemCount: (p) => phenopacketExperimentResults(p).length,
    render: (p) => <ExperimentResultView packetId={p.id} experimentResults={phenopacketExperimentResults(p)} />,
    order: 8,
  },
  extraProperties: {
    titleTranslationKey: 'tab_keys.extra_properties',
    enabled: (p) => objectToBoolean(p.extra_properties),
    render: (p) => <ExtraPropertiesDisplay extraProperties={p.extra_properties} />,
    order: 9,
  },
};
