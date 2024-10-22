import { Col, Row } from 'antd';
import { useBeaconNetwork } from '@/features/beacon/hooks';
import NodeDetails from './NetworkNodeDetails/NodeDetails';

const NetworkBeacons = () => {
  const { beacons, beaconResponses } = useBeaconNetwork();

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

export default NetworkBeacons;
