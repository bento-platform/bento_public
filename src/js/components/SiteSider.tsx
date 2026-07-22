import clsx from 'clsx';
import { Layout } from 'antd';
import SearchForm from '@/components/Search/SearchForm';
import Sidebar from '@/components/Sidebar/Sidebar';

const SiteSider = ({
  overlay,
  open,
  onClose,
}: {
  /** Below some breakpoint, the sider renders as a fixed slide-over drawer instead of an inline sticky column. */
  overlay: boolean;
  /** Ignored when `overlay` is falsy (the sider is always visible inline). */
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Layout.Sider width="auto" id="site-sider" className={clsx({ overlay })}>
      <Sidebar className="shadow" id="site-sider__inner" overlay={overlay} open={open} onClose={onClose}>
        <SearchForm />
      </Sidebar>
    </Layout.Sider>
  );
};

export default SiteSider;
