import clsx from 'clsx';
import { Divider, Input, Layout, Typography } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import SearchForm from '@/components/Search/SearchForm';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useTranslationFn } from '@/hooks';

const SiteSider = ({ collapsed, overlay }: { collapsed: boolean; overlay: boolean }) => {
  const t = useTranslationFn();
  const { scope } = useSelectedScope();
  return (
    <Layout.Sider
      width="auto"
      id="site-sider"
      className={clsx({ overlay: overlay, collapsed: overlay && collapsed })}
      style={{
        minHeight: scope.project ? 'calc(100vh - var(--header-height) - var(--content-scoped-title-height))' : 0,
      }}
    >
      <div id="site-sider__inner">
        {scope.project ? (
          <>
            <SearchForm />
            <Divider className="m-0" />
          </>
        ) : (
          // TODO: hook up catalogue search
          <>
            <Typography.Title level={3} className="search-sub-form-title">
              <FormOutlined /> {t('search.text_search')}
            </Typography.Title>
            <Input.Search />
          </>
        )}
      </div>
    </Layout.Sider>
  );
};

export default SiteSider;
