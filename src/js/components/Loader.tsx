import { Row, Col, Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

const Loader = ({ fullHeight }: { fullHeight?: boolean }) => {
  // If we're nested, remove the (rough) height of header + footer to give a (roughly) full-screen loader.
  return (
    <Row justify="center" align="middle" style={{ height: fullHeight ? '100vh' : 'calc(100vh - 440px)' }}>
      <Col>
        <Spin indicator={<Loading3QuartersOutlined style={{ fontSize: 40 }} spin />} />
      </Col>
    </Row>
  );
};

export default Loader;
