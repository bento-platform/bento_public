import { Fragment } from 'react';
import { Tooltip } from 'antd';

import PhenopacketLink from '@/components/ClinPhen/PhenopacketLink';

import type { Experiment } from '@/types/clinPhen/experiments/experiment';

const ExperimentReferences = ({
  packetId,
  experiments,
}: {
  packetId?: string;
  experiments: Pick<Experiment, 'experiment_type' | 'id'>[];
}) => {
  const typeSafeExperiments = experiments ? [...experiments] : [];
  const sorted = typeSafeExperiments
    .sort((a, b) => a.experiment_type.localeCompare(b.experiment_type) || a.id.localeCompare(b.id))
    .map((e, _, arr) => ({
      ...e,
      typeIndex: arr.slice(0, arr.indexOf(e)).filter((x) => x.experiment_type === e.experiment_type).length + 1,
      hasDuplicates: arr.filter((x) => x.experiment_type === e.experiment_type).length > 1,
    }));
  return (
    <div>
      {sorted.map((e, i) => (
        <Fragment key={e.id}>
          <PhenopacketLink.Experiment packetId={packetId} experimentId={e.id}>
            <Tooltip title={e.id} styles={{ body: { wordWrap: 'normal', inlineSize: 'max-content' } }}>
              {e.experiment_type}{e.hasDuplicates ? ` (${e.typeIndex})` : ''}
            </Tooltip>
          </PhenopacketLink.Experiment>

          {i < sorted.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
    </div>
  );
};

export default ExperimentReferences;
