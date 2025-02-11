import { Row, Col, Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

const Loader = ({ nested }: { nested?: boolean }) => {
  // If we're nested, remove the (rough) height of header + footer to give a (roughly) full-screen loader.
  return (
    <Row justify="center" align="middle" style={{ height: nested ? 'calc(100vh - 440px)' : '100vh' }}>
      <Col>
        <Spin indicator={<Loading3QuartersOutlined style={{ fontSize: 40 }} spin />} />
      </Col>
    </Row>
  );
};

export default Loader;
