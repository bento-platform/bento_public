import { Fragment } from 'react';
import { Popover } from 'antd';

import PhenopacketLink from '@/components/ClinPhen/PhenopacketLink';
import TDescriptions from '@Util/TDescriptions';
import FreeTextAndOrOntologyClass from './FreeTextAndOrOntologyClass';

import type { ConditionalDescriptionItem } from '@/types/descriptions';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { MatchIncludedFieldsFromExperiments } from '@/features/search/types';
import { useTranslationFn } from '@/hooks';

const ExperimentPopoverContent = ({ e }: { e: Pick<Experiment, MatchIncludedFieldsFromExperiments> }) => {
  const items: ConditionalDescriptionItem[] = [
    { key: 'experiment_id', children: e.id },
    { key: 'description', children: e.description },
    { key: 'study_type', children: e.study_type },
    {
      key: 'molecule',
      children: <FreeTextAndOrOntologyClass text={e.molecule} ontologyClass={e.molecule_ontology} />,
      isVisible: e?.molecule_ontology || e?.molecule,
    },
  ];
  return <TDescriptions column={1} items={items} size="compact" defaultI18nPrefix="experiment." bordered />;
};

const ExperimentReferences = ({
  packetId,
  experiments,
}: {
  packetId?: string;
  experiments?: Pick<Experiment, MatchIncludedFieldsFromExperiments>[];
}) => {
  const t = useTranslationFn();

  if (!experiments) return;

  const sorted = [...experiments]
    .sort((a, b) => a.experiment_type.localeCompare(b.experiment_type) || a.id.localeCompare(b.id))
    .map((e, _, arr) => ({
      ...e,
      displayType:
        e.experiment_type === 'Other' && e.experiment_ontology?.label ? e.experiment_ontology.label : e.experiment_type,
      typeIndex: arr.slice(0, arr.indexOf(e)).filter((x) => x.experiment_type === e.experiment_type).length + 1,
      hasDuplicates: arr.filter((x) => x.experiment_type === e.experiment_type).length > 1,
      content: <ExperimentPopoverContent e={e} />,
    }));

  return (
    <div>
      {sorted.map((e, i) => (
        <Fragment key={e.id}>
          <PhenopacketLink.Experiment packetId={packetId} experimentId={e.id} preserveQueryParams>
            <Popover content={e.content}>
              {t(e.displayType)}
              {e.hasDuplicates ? ` (${e.typeIndex})` : ''}
            </Popover>
          </PhenopacketLink.Experiment>

          {i < sorted.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
    </div>
  );
};

export default ExperimentReferences;
