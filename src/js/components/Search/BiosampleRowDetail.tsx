import type { HTMLAttributes } from 'react';
import { Skeleton } from 'antd';

import {
  BiosampleDetail,
  type BiosampleDetailProps,
  isBiosampleRowExpandable,
} from '@/components/ClinPhen/PhenopacketDisplay/BiosampleView';
import CustomEmpty from '@Util/CustomEmpty';
import { WAITING_STATES } from '@/constants/requests';
import { useBiosampleData } from '@/features/clinPhen/hooks';

const BiosampleRowDetail = ({
  id,
  mode,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  id: string;
  mode?: BiosampleDetailProps['mode'];
}) => {
  const { data: biosampleData, status: biosampleDataStatus } = useBiosampleData(id);
  const isFetchingBiosampleData = WAITING_STATES.includes(biosampleDataStatus);

  // TODO: need to inject ontology resources into view (for ontology terms) somehow
  return (
    <div {...props}>
      {!biosampleData || isFetchingBiosampleData ? (
        <Skeleton active title={false} paragraph={{ rows: 3 }} style={{ marginTop: 8 }} />
      ) : isBiosampleRowExpandable(biosampleData, true) ? (
        <BiosampleDetail biosample={biosampleData} mode={mode} />
      ) : (
        <CustomEmpty text="No Data" simple={true} style={{ marginBlock: 12 }} />
      )}
    </div>
  );
};

export default BiosampleRowDetail;
