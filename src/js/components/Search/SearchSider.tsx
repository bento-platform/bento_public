import type { CSSProperties } from 'react';
import { Divider, Input, Layout, Typography } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import SearchForm from '@/components/Search/SearchForm';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useTranslationFn } from '@/hooks';

const FILTERS_STYLE = {
  width: 'var(--sidebar-width-full)',
  overflowY: 'scroll',
  maxHeight: 'calc(100vh - var(--header-height) - var(--content-scoped-title-height) - 1px)',
} as CSSProperties;

const SearchSider = ({ overlay }: { overlay: boolean }) => {
  const t = useTranslationFn();
  const { scope } = useSelectedScope();
  return (
    <Layout.Sider
      width="auto"
      style={{
        position: overlay ? 'fixed' : 'relative',
        zIndex: 19,
        backgroundColor: 'white',
        borderRight: '1px solid #eee',
        minHeight: scope.project ? 'calc(100vh - var(--header-height) - var(--content-scoped-title-height))' : 0,
        boxShadow: overlay ? '3px 0 10px rgba(0, 0, 0, 0.06)' : undefined,
      }}
    >
      {scope.project ? (
        <div
          className="sticky"
          style={{
            ...FILTERS_STYLE,
            top: 'calc(var(--content-scoped-title-height) + 1px)',
          }}
        >
          <SearchForm />
          <Divider className="m-0" />
        </div>
      ) : (
        <div className="sticky" style={{ ...FILTERS_STYLE, top: 0, padding: 24, boxSizing: 'border-box' }}>
          {/* TODO: Hook up catalogue search */}
          <Typography.Title level={3} className="search-sub-form-title">
            <FormOutlined /> {t('search.text_search')}
          </Typography.Title>
          <Input.Search />
        </div>
      )}
    </Layout.Sider>
  );
};

export default SearchSider;
