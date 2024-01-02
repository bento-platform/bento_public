import React, { ReactNode } from 'react';

import { Layout } from 'antd';
const { Content } = Layout;

import SiteHeader from '@/components/Layout/SiteHeader';
import SiteFooter from '@/components/Layout/SiteFooter';
import SiteSider from '@/components/Layout/SiteSider';

const MainPageLayout: React.FC<MainPageLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiteSider />
      <Layout>
        <SiteHeader />
        <Content style={{ padding: '0 30px', marginTop: '10px' }}>{children}</Content>
        <SiteFooter />
      </Layout>
    </Layout>
  );
};

interface MainPageLayoutProps {
  children: ReactNode;
}

export default MainPageLayout;
