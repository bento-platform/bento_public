import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '@/components/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetPhenopacketData } from '@/features/clinPhen/makeGetPhenopacket.thunk';
import { Card } from 'antd';
import { RequestStatus } from '@/types/requests';

interface RouteParams {
  packetId: string;
  [key: string]: string | undefined;
}

const PhenopacketView = () => {
  const { packetId } = useParams<RouteParams>();
  const dispatch = useAppDispatch();
  const phenopacket = useAppSelector((state) => state.clinPhen.phenopacketDataCache[packetId ?? '']);
  const status = useAppSelector((state) => state.clinPhen.phenopacketDataStatus[packetId ?? '']);

  useEffect(() => {
    if (packetId && !phenopacket && status !== RequestStatus.Pending) {
      dispatch(makeGetPhenopacketData(packetId));
    }
  }, [packetId, phenopacket, status, dispatch]);

  if (status === RequestStatus.Pending || !phenopacket) {
    return <Loader fullHeight={true} />;
  }

  return (
    <Card title={packetId}>
      <pre>{JSON.stringify(phenopacket, null, 2)}</pre>
    </Card>
  );
};

export default PhenopacketView;
