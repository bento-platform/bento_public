import type { HTMLAttributes } from 'react';
import { Skeleton } from 'antd';

import SubjectView from '@/components/ClinPhen/PhenopacketDisplay/SubjectView';
import { WAITING_STATES } from '@/constants/requests';
import { useIndividualData } from '@/features/clinPhen/hooks';

const IndividualDetailView = ({ id, ...props }: HTMLAttributes<HTMLDivElement> & { id: string }) => {
  const { data: individualData, status: individualDataStatus } = useIndividualData(id);
  const isFetchingIndividualData = WAITING_STATES.includes(individualDataStatus);

  return (
    <div {...props}>
      {!individualData || isFetchingIndividualData ? (
        <Skeleton active title={false} paragraph={{ rows: 3 }} style={{ marginTop: 8 }} />
      ) : (
        // TODO: need to inject ontology resources into subject view (for taxonomy) somehow
        <SubjectView subject={individualData} spaceSize="small" />
      )}
    </div>
  );
};

export default IndividualDetailView;
