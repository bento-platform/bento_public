import { Col, Row } from 'antd';
import { useAppSelector } from '@/hooks';
import type { NetworkBeacon } from '@/types/beaconNetwork';
import NodeDetails from './NetworkNodeDetails/NodeDetails';

const NetworkBeacons = ({ beacons }: NetworkBeaconsProps) => {
  const beaconResponses = useAppSelector((state) => state.beaconNetworkResponse.beacons);

  // for now, render all beacons from the start and update as they respond (NodeDetails component is memoized)
  // they could be shown optionally if network is very large (ie could just show only beacons with non-zero responses)
  return (
    <Row gutter={[8, 8]} style={{ maxWidth: 1200 }}>
      {beacons.map((b) => (
        <Col lg={24} xl={12} key={b.id}>
          <NodeDetails beacon={b} key={b.id} response={beaconResponses[b.id] ?? {}} />
        </Col>
      ))}
    </Row>
  );
};

export interface NetworkBeaconsProps {
  beacons: NetworkBeacon[];
}

export default NetworkBeacons;
