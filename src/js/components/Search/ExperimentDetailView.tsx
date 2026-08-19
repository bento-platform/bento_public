import { Skeleton } from 'antd';

import {
  ExperimentExpandedRow,
  type ExperimentExpandedRowProps,
  isExperimentRowExpandable,
} from '@/components/ClinPhen/ExperimentDisplay/ExperimentView';
import CustomEmpty from '@Util/CustomEmpty';
import { WAITING_STATES } from '@/constants/requests';
import { useExperimentData } from '@/features/clinPhen/hooks';
import type { HTMLAttributes } from 'react';

const ExperimentDetailView = ({
  id,
  mode,
  ...props
}: HTMLAttributes<HTMLDivElement> & { id: string; mode?: ExperimentExpandedRowProps['mode'] }) => {
  const { data: experimentData, status } = useExperimentData(id);
  const isFetchingData = WAITING_STATES.includes(status);

  // TODO: need to inject ontology resources into view (for ontology terms) somehow
  return (
    <div {...props}>
      {!experimentData || isFetchingData ? (
        <Skeleton active title={false} paragraph={{ rows: 3 }} style={{ marginTop: 8 }} />
      ) : isExperimentRowExpandable(experimentData) ? (
        <ExperimentExpandedRow experiment={experimentData} mode={mode} />
      ) : (
        <CustomEmpty text="No Data" simple={true} style={{ marginBlock: 12 }} />
      )}
    </div>
  );
};

export default ExperimentDetailView;
