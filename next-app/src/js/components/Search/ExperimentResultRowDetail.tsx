import { Skeleton } from 'antd';

import {
  ExperimentResultExpandedRow,
  isExperimentResultRowExpandable,
} from '@/components/ClinPhen/ExperimentDisplay/ExperimentResultView';
import CustomEmpty from '@Util/CustomEmpty';
import { WAITING_STATES } from '@/constants/requests';
import { useExperimentResultData } from '@/features/clinPhen/hooks';

const ExperimentResultRowDetail = ({ id }: { id: number }) => {
  const { data: experimentResultData, status } = useExperimentResultData(id);
  const isFetchingData = WAITING_STATES.includes(status);

  // TODO: need to inject ontology resources into view (for ontology terms) somehow
  return !experimentResultData || isFetchingData ? (
    <Skeleton active title={false} paragraph={{ rows: 3 }} style={{ marginTop: 8 }} />
  ) : isExperimentResultRowExpandable(experimentResultData) ? (
    <ExperimentResultExpandedRow experimentResult={experimentResultData} searchRow={true} />
  ) : (
    <CustomEmpty text="No Data" simple={true} style={{ marginBlock: 12 }} />
  );
};

export default ExperimentResultRowDetail;
