import { useParams } from 'react-router-dom';
import { Card } from 'antd'; // added antd Card import

interface RouteParams {
  packetId: string;
  [key: string]: string | undefined;
}

const PhenopacketView = () => {
  const { packetId } = useParams<RouteParams>();

  return (
    <Card title={packetId}>
      <p>Packet ID: {packetId}</p>
    </Card>
  );
};

export default PhenopacketView;
