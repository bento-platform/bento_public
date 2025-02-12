import { Row, Col, Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

// This could be computed by JavaScript, but that's a waste of resources. Instead, we'll store approximate height.
const APPROX_FOOTER_HEIGHT = 222;

const Loader = ({ fullHeight }: { fullHeight?: boolean }) => {
  // If we're not in a full-height context (i.e., we're inside a page), remove the height of header + footer + padding
  // to give back a (roughly) full-page loading screen.
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: fullHeight
          ? '100vh'
          : `calc(100vh - 74px - ${APPROX_FOOTER_HEIGHT}px - 2*var(--content-padding-v) - var(--header-height))`,
      }}
    >
      <Col>
        <Spin indicator={<Loading3QuartersOutlined style={{ fontSize: 40 }} spin />} />
      </Col>
    </Row>
  );
};

export default Loader;
