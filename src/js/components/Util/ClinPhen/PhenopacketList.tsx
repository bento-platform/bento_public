import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from 'antd';
import { makeGetPhenopacketList } from '@/features/clinPhen/makeGetPhenopacketList.thunk';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import { useAppDispatch } from '@/hooks';
import Loader from '@/components/Loader';

const { Title, Paragraph } = Typography;

export const PhenopacketList = () => {
  const dispatch = useAppDispatch();
  const { phenopacketList, phenopacketListStatus } = useSelector((state: RootState) => state.clinPhen);

  useEffect(() => {
    dispatch(makeGetPhenopacketList());
  }, [dispatch]);

  if (phenopacketListStatus === RequestStatus.Pending) {
    return <Loader fullHeight={true} />;
  }

  if (phenopacketListStatus === RequestStatus.Rejected) {
    return <Paragraph type="danger">Failed to load phenopackets</Paragraph>;
  }

  return (
    <div>
      <Title level={2}>Phenopacket List</Title>
      <Paragraph>
        <pre>{JSON.stringify(phenopacketList, null, 2)}</pre>
      </Paragraph>
    </div>
  );
};

export default PhenopacketList;
