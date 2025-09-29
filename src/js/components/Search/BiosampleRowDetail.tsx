import { Skeleton } from 'antd';

import { BiosampleExpandedRow, isBiosampleRowExpandable } from '@/components/ClinPhen/PhenopacketDisplay/BiosampleView';
import CustomEmpty from '@Util/CustomEmpty';
import { WAITING_STATES } from '@/constants/requests';
import { useBiosampleData } from '@/features/clinPhen/hooks';

const BiosampleRowDetail = ({ id }: { id: string }) => {
  const { data: biosampleData, status: biosampleDataStatus } = useBiosampleData(id);
  const isFetchingBiosampleData = WAITING_STATES.includes(biosampleDataStatus);

  // TODO: need to inject ontology resources into view (for ontology terms) somehow
  return !biosampleData || isFetchingBiosampleData ? (
    <Skeleton active title={false} paragraph={{ rows: 3 }} style={{ marginTop: 8 }} />
  ) : isBiosampleRowExpandable(biosampleData, true) ? (
    <BiosampleExpandedRow biosample={biosampleData} searchRow={true} />
  ) : (
    <CustomEmpty text="No Data" simple={true} style={{ marginBlock: 12 }} />
  );
};

export default BiosampleRowDetail;
