import React, { useMemo } from 'react';
import { Button, Cascader, Flex, Layout, Typography, Space } from 'antd';
const { Header } = Layout;
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from 'bento-auth-js';
import { CLIENT_NAME, PORTAL_URL, TRANSLATED } from '@/config';
import { RiTranslate } from 'react-icons/ri';
import { ExportOutlined, LinkOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { selectScope } from '@/features/metadata/metadata.store';

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

const SiteHeader: React.FC = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isFetching: openIdConfigFetching } = useAppSelector((state) => state.openIdConfiguration);
  const { isHandingOffCodeForToken } = useAppSelector((state) => state.auth);
  const { projects, selectedScope } = useAppSelector((state) => state.metadata);
  const scopeOptions = useMemo(() => {
    return projects.map((p) => ({
      value: p.identifier,
      label: p.title,
      children: p.datasets.map((d) => ({
        value: d.identifier,
        label: d.title,
      })),
    }));
  }, [projects]);

  const onScopeChange = (value: (string | number)[] | undefined) => {
    console.log('value', value);
    const oldpath = location.pathname.split('/').filter(Boolean);
    const newPath = [oldpath[0]];
    if (value === undefined) {
      value = [];
    }
    if (value.length === 1) {
      dispatch(selectScope({ project: value[0] as string }));
      newPath.push('p', value[0] as string);
    } else if (value.length === 2) {
      dispatch(selectScope({ project: value[0] as string, dataset: value[1] as string }));
      newPath.push('p', value[0] as string, 'd', value[1] as string);
    } else {
      dispatch(selectScope({}));
    }
    const oldPathLength = oldpath.length;
    if (oldpath[oldPathLength - 3] === 'p' || oldpath[oldPathLength - 3] === 'd') {
      newPath.push(oldpath[oldPathLength - 1]);
    }
    const newPathString = '/' + newPath.join('/');
    navigate(newPathString, { replace: true });
  };

  const isAuthenticated = useIsAuthenticated();
  const performSignOut = usePerformSignOut();
  const performSignIn = usePerformAuth();

  document.title = CLIENT_NAME && CLIENT_NAME.trim() ? `Bento: ${CLIENT_NAME}` : 'Bento';

  const changeLanguage = () => {
    const newLang = LNG_CHANGE[i18n.language];
    const path = (location.pathname + location.search).replace(`/${i18n.language}/`, `/${newLang}/`);
    navigate(path, { replace: true });
  };

  return (
    <Header style={{ position: 'fixed', width: '100%', zIndex: 100, top: 0 }}>
      <Flex align="center" justify="space-between">
        <Space size="middle">
          <img
            src="/public/assets/branding.png"
            alt="logo"
            style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)' }}
            onClick={() => navigate('/')}
          />

          <Typography.Title
            level={1}
            style={{ fontSize: '18px', margin: 0, lineHeight: '64px', color: 'white' }}
            type="secondary"
          >
            {CLIENT_NAME}
          </Typography.Title>
          <Cascader
            options={scopeOptions}
            onChange={onScopeChange}
            value={Object.values(selectedScope).filter((v): v is string => typeof v === 'string')}
            placeholder="Select Scope"
            changeOnSelect
            allowClear
          />
        </Space>

        <Space size="small">
          {TRANSLATED && (
            <Button
              type="text"
              className="header-button"
              icon={<RiTranslate style={{ transform: 'translateY(1px)' }} />}
              onClick={changeLanguage}
            >
              {LNGS_FULL_NAMES[LNG_CHANGE[i18n.language]]}
            </Button>
          )}
          <Button type="text" className="header-button" icon={<LinkOutlined />} onClick={openPortalWindow}>
            {t('Portal')}
            <ExportOutlined />
          </Button>
          {isAuthenticated ? (
            <Button type="text" className="header-button" icon={<LogoutOutlined />} onClick={performSignOut}>
              {t('Sign Out')}
            </Button>
          ) : (
            <Button type="primary" shape="round" icon={<LoginOutlined />} onClick={performSignIn}>
              {openIdConfigFetching || isHandingOffCodeForToken ? t('Loading...') : t('Sign In')}
            </Button>
          )}
        </Space>
      </Flex>
    </Header>
  );
};

export default SiteHeader;
