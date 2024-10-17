import { Col, Row } from 'antd';
import { useAppSelector } from '@/hooks';
import type { NetworkBeacon } from '@/types/beaconNetwork';
import NodeDetails from './NetworkNodeDetails/NodeDetails';

const NetworkBeacons = ({ beacons }: NetworkBeaconsProps) => {
  const beaconResponses = useAppSelector((state) => state.beaconNetworkResponse.beacons);

  // For now, render all beacons from the start and update as they respond (NodeDetails component is memoized).
  // They could be shown optionally if network is very large (ie could just show only beacons with non-zero responses).
  // The response prop may be undefined if the response for the beacon is not yet loaded.
  return (
    <Row gutter={[8, 8]} style={{ width: '100%', maxWidth: 1200 }}>
      {beacons.map((b) => (
        <Col span={24} xl={12} key={b.id}>
          <NodeDetails beacon={b} key={b.id} response={beaconResponses[b.id]} />
        </Col>
      ))}
    </Row>
  );
};

export interface NetworkBeaconsProps {
  beacons: NetworkBeacon[];
}

export default NetworkBeacons;
