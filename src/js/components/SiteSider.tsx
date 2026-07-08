import clsx from 'clsx';
import { Layout } from 'antd';
import SearchForm from '@/components/Search/SearchForm';
import Sidebar from '@/components/Sidebar/Sidebar';

const SiteSider = ({ collapsed, overlay }: { collapsed: boolean; overlay: boolean }) => {
  return (
    <Layout.Sider width="auto" id="site-sider" className={clsx({ overlay: overlay, collapsed: overlay && collapsed })}>
      <Sidebar className="shadow" id="site-sider__inner">
        <SearchForm />
      </Sidebar>
    </Layout.Sider>
  );
};

export default SiteSider;
