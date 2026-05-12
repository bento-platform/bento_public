import clsx from 'clsx';
import { Divider, Layout } from 'antd';
import SearchForm from '@/components/Search/SearchForm';
import { useSelectedScope } from '@/features/metadata/hooks';

const SearchSider = ({ collapsed, overlay }: { collapsed: boolean; overlay: boolean }) => {
  const { scope } = useSelectedScope();
  return (
    <Layout.Sider
      width="auto"
      id="search-sider"
      className={clsx({ overlay: overlay, collapsed: overlay && collapsed })}
      style={{
        minHeight: scope.project ? 'calc(100vh - var(--header-height) - var(--content-scoped-title-height))' : 0,
      }}
    >
      {
        scope.project ? (
          <div id="search-sider__inner" style={{ top: 'calc(var(--content-scoped-title-height) + 1px)' }}>
            <SearchForm />
            <Divider className="m-0" />
          </div>
        ) : null
        // TODO: hook up catalogue search
        // <div id="search-sider__inner" style={{ top: 0, padding: 24, boxSizing: 'border-box' }}>
        //   <Typography.Title level={3} className="search-sub-form-title">
        //     <FormOutlined /> {t('search.text_search')}
        //   </Typography.Title>
        //   <Input.Search />
        // </div>
      }
    </Layout.Sider>
  );
};

export default SearchSider;
