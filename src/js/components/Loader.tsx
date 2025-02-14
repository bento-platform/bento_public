import { Row, Col, Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

// This could be computed by JavaScript, but that's a waste of resources. Instead, we'll store approximate height.
const APPROX_FOOTER_HEIGHT = 222;

// If we're not in a full-height context (i.e., we're inside a page), remove the height of header + footer + padding
// to give back a (roughly) full-page loading screen.
const CSS_HEIGHT_TO_REMOVE = [
  'var(--content-scoped-title-height)',
  'var(--content-scoped-title-margin-bottom)',
  `${APPROX_FOOTER_HEIGHT}px`,
  '2 * var(--content-padding-v)',
  'var(--header-height)',
].join(' + ');

const Loader = ({ fullHeight }: { fullHeight?: boolean }) => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: fullHeight ? '100vh' : `calc(100vh - (${CSS_HEIGHT_TO_REMOVE})` }}
    >
      <Col>
        <Spin indicator={<Loading3QuartersOutlined style={{ fontSize: 40 }} spin />} />
      </Col>
    </Row>
  );
};

export default Loader;
