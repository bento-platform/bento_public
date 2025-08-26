import { Skeleton } from 'antd';

import { BiosampleExpandedRow } from '@/components/ClinPhen/PhenopacketDisplay/BiosampleView';
import { WAITING_STATES } from '@/constants/requests';
import { useBiosampleData } from '@/features/clinPhen/hooks';

const BiosampleRowDetail = ({ id }: { id: string }) => {
  const { data: biosampleData, status: biosampleDataStatus } = useBiosampleData(id);
  const isFetchingBiosampleData = WAITING_STATES.includes(biosampleDataStatus);

  return !biosampleData || isFetchingBiosampleData ? (
    <Skeleton active title={false} paragraph={{ rows: 3 }} style={{ marginTop: 8 }} />
  ) : (
    // TODO: need to inject ontology resources into view (for ontology terms) somehow
    <BiosampleExpandedRow biosample={biosampleData} searchRow={true} />
  );
};

export default BiosampleRowDetail;
