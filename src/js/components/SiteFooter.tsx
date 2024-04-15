import React from 'react';
import { Layout, Row, Typography, Space } from 'antd';
const { Footer } = Layout;
const { Title, Text, Link } = Typography;

import { useTranslationDefault } from '@/hooks';
import bentoLogo from '@public/assets/bento.svg';

const SiteFooter = () => {
  const td = useTranslationDefault();

  return (
    <Footer>
      <Row justify="center">
        <Space size={8} direction="vertical" align="center">
          <div>
            <Title level={5} type="secondary" style={{ marginBottom: '0' }}>
              Powered by
            </Title>
            <Link href="https://bento-platform.github.io" target="_blank">
              <img style={{ height: '36px' }} src={bentoLogo} alt="Bento" />
            </Link>
          </div>
          <div>
            <Text type="secondary">
              Copyright &copy; 2019-2024 the{' '}
              <Link href="https://computationalgenomics.ca" target="_blank">
                Canadian Centre for Computational Genomics
              </Link>
              .
            </Text>
            <br />
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
          </div>
          <div>
            <Link href="/public/terms.html" target="_blank">
              {td('Terms of Use')}
            </Link>
          </div>
        </Space>
      </Row>
    </Footer>
  );
};

export default SiteFooter;
