import clsx from 'clsx';
import { Divider, Input, Layout } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import SearchForm from '@/components/Search/SearchForm';
import FacetSider from '@/components/Util/FacetSider';
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
      <FacetSider
        id="site-sider__inner"
        classPrefix="site-sider-shell"
        overlay={false}
        open
        title={
          scope.project ? undefined : (
            <>
              <FormOutlined /> {t('search.text_search')}
            </>
          )
        }
      >
        {scope.project ? (
          <>
            <SearchForm />
            <Divider className="m-0" />
          </>
        ) : (
          // TODO: hook up catalogue search
          <Input.Search />
        )}
      </FacetSider>
    </Layout.Sider>
  );
};

export default SiteSider;
