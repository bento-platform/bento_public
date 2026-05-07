import type { CSSProperties } from 'react';
import { Input, Layout, Typography } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import SearchForm from '@/components/Search/SearchForm';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useTranslationFn } from '@/hooks';

const filtersStyle = {
  padding: 24,
  boxSizing: 'border-box',
  width: 'var(--sidebar-width-full)',
  top: 'calc(var(--content-scoped-title-height) + 1px)',
} as CSSProperties;

const SearchSider = () => {
  const t = useTranslationFn();
  const { scope } = useSelectedScope();
  return (
    <Layout.Sider
      width="auto"
      style={{
        backgroundColor: 'white',
        borderRight: '1px solid #eee',
        minHeight: 'calc(100vh - var(--header-height) - var(--content-scoped-title-height))',
      }}
    >
      {scope.project ? (
        <div className="sticky" style={filtersStyle}>
          <SearchForm vertical={true} />
        </div>
      ) : (
        <div className="sticky" style={filtersStyle}>
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
