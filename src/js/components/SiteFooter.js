import React from 'react';
import { Layout, Row, Typography, Space } from 'antd';
const { Footer } = Layout;
const { Title, Text, Link } = Typography;

import bentoLogo from '../../public/assets/bento.svg';

const SiteFooter = () => {
  return (
    <Footer>
      <Row justify="center">
        <Space size={0} direction="vertical" align="center">
          <div>
            <Title level={5} type="secondary">
              Powered by
            </Title>
            <img style={{ height: '25px' }} src={bentoLogo} alt="Bento" />
          </div>
          <Text type="secondary">
            Copyright &copy; 2019-2022 the{' '}
            <Link href="http://computationalgenomics.ca" target="_blank">
              Canadian Centre for Computational Genomics
            </Link>
            .
          </Text>
          <Text type="secondary">
            Bento is licensed under the{' '}
            <Link href="https://github.com/bento-platform/bento_public/blob/main/LICENSE" target="_blank">
              LGPLv3
            </Link>
            . The source code is available on{' '}
            <Link href="https://github.com/bento-platform" target="_blank">
              Github
            </Link>
            .
          </Text>
          <Link href="/public/terms.html" target="_blank">
            Terms of Use
          </Link>
        </Space>
      </Row>
    </Footer>
  );
};

export default SiteFooter;
