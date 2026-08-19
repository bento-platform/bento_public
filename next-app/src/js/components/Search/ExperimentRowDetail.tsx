import { Skeleton } from 'antd';

import {
  ExperimentExpandedRow,
  isExperimentRowExpandable,
} from '@/components/ClinPhen/ExperimentDisplay/ExperimentView';
import CustomEmpty from '@Util/CustomEmpty';
import { WAITING_STATES } from '@/constants/requests';
import { useExperimentData } from '@/features/clinPhen/hooks';

const ExperimentRowDetail = ({ id }: { id: string }) => {
  const { data: experimentData, status } = useExperimentData(id);
  const isFetchingData = WAITING_STATES.includes(status);

  // TODO: need to inject ontology resources into view (for ontology terms) somehow
  return !experimentData || isFetchingData ? (
    <Skeleton active title={false} paragraph={{ rows: 3 }} style={{ marginTop: 8 }} />
  ) : isExperimentRowExpandable(experimentData) ? (
    <ExperimentExpandedRow experiment={experimentData} searchRow={true} />
  ) : (
    <CustomEmpty text="No Data" simple={true} style={{ marginBlock: 12 }} />
  );
};

export default ExperimentRowDetail;
