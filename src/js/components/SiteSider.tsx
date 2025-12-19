import { type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Input, type SiderProps, Typography } from 'antd';
import { Button, Divider, Layout } from 'antd';
import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useIsInCatalogueMode, useNavigateToRoot } from '@/hooks/navigation';
import { getCurrentPage } from '@/utils/router';
import SearchForm from '@/components/Search/SearchForm';

const { Sider } = Layout;

const filtersStyle = { padding: 16, boxSizing: 'border-box', width: 'var(--sidebar-width-full)' } as CSSProperties;

const SiteSider = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: SiderProps['onCollapse'] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useLanguage();
  const t = useTranslationFn();
  const catalogueMode = useIsInCatalogueMode();
  const page = getCurrentPage(location);
  console.log(page);

  const navigateToRoot = useNavigateToRoot();
  const { scope, scopeSet } = useSelectedScope();

  return (
    <Sider
      id="site-sider"
      // Collapsed width can be synced with our stylesheet via CSS variable:
      width="var(--sidebar-width-full)"
      collapsedWidth="var(--sidebar-width-collapsed)"
      collapsible
      breakpoint="md"
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
    >
      {scope.project && catalogueMode ? (
        <>
          <div style={{ backgroundColor: '#FAFAFA' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              style={{ margin: 4, width: 'calc(100% - 8px)', height: 38 }}
              onClick={scope.dataset ? () => navigate(`/${language}/p/${scope.project}`) : navigateToRoot}
            >
              {collapsed || !scopeSet ? null : t(scope.dataset ? 'Back to project' : 'Back to catalogue')}
            </Button>
          </div>
          <Divider className="m-0" />
          <div style={filtersStyle}>
            <SearchForm vertical={true} />
          </div>
        </>
      ) : (
        <div style={filtersStyle}>
          {/* TODO: Hook up catalogue search */}
          <Typography.Title level={3} className="search-sub-form-title">
            <FormOutlined /> {t('search.text_search')}
          </Typography.Title>
          <Input.Search />
        </div>
      )}
      {/*<Menu*/}
      {/*  selectedKeys={[currentPage]}*/}
      {/*  mode="inline"*/}
      {/*  items={items}*/}
      {/*  onClick={handleMenuClick}*/}
      {/*  style={{ border: 'none' }}*/}
      {/*/>*/}
    </Sider>
  );
};

export default SiteSider;
