import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Flex, Layout, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuthState, useIsAuthenticated, useOpenIdConfig, usePerformAuth, usePerformSignOut } from 'bento-auth-js';

import { RiTranslate } from 'react-icons/ri';
import { ExportOutlined, LinkOutlined, LoginOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';

import { useAppSelector } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { scopeToUrl } from '@/utils/router';

import { DEFAULT_TRANSLATION, LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { CLIENT_NAME, PORTAL_URL, TRANSLATED } from '@/config';

import ScopePickerModal from './Scope/ScopePickerModal';

const { Header } = Layout;

// Header padding is set to 4px on left to align logo with sider icons
// Header padding is set to 24px on right to provide breathing room for buttons
const HEADER_PADDING: React.CSSProperties = { padding: '0 24px 0 4px' };

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

const SiteHeader = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useSmallScreen();

  const { isFetching: openIdConfigFetching } = useOpenIdConfig();
  const { isHandingOffCodeForToken } = useAuthState();
  const { projects, selectedScope } = useAppSelector((state) => state.metadata);
  const { scope: scopeObj } = selectedScope;

  const scopeSelectionEnabled = !(selectedScope.fixedProject && selectedScope.fixedDataset);

  const scopeProps = useMemo(
    () => ({
      projectTitle: projects.find((project) => project.identifier === scopeObj.project)?.title,
      datasetTitle: scopeObj.dataset
        ? projects
            .find((project) => project.identifier === scopeObj.project)
            ?.datasets.find((dataset) => dataset.identifier === scopeObj.dataset)?.title
        : null,
    }),
    [projects, scopeObj]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(false);
  }, [location]);

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
    <Header style={{ position: 'fixed', width: '100%', zIndex: 100, top: 0, ...HEADER_PADDING }}>
      <Flex align="center" justify="space-between">
        <Space size={isSmallScreen ? 'small' : 'middle'}>
          {isSmallScreen ? (
            <object
              type="image/png"
              data="/public/assets/icon_small.png"
              aria-label="logo"
              style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)', paddingLeft: '23px' }}
              onClick={() => navigate(`/${i18n.language}${scopeToUrl(scopeObj)}`)}
            >
              <img
                src="/public/assets/branding.png"
                alt="logo"
                style={{
                  height: '32px',
                  verticalAlign: 'middle',
                  transform: 'translateY(-3px)',
                  paddingLeft: '23px',
                }}
                onClick={() => navigate(`/${i18n.language}${scopeToUrl(scopeObj)}`)}
              />
            </object>
          ) : (
            <img
              src="/public/assets/branding.png"
              alt="logo"
              style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)', paddingLeft: '4px' }}
              onClick={() => navigate(`/${i18n.language}${scopeToUrl(scopeObj)}`)}
            />
          )}
          <Typography.Title
            level={1}
            style={{ fontSize: '1.5em', margin: 0, lineHeight: '64px', color: 'white' }}
            type="secondary"
          >
            {CLIENT_NAME}
          </Typography.Title>
          {scopeSelectionEnabled && (
            <Typography.Title
              className="select-project-title"
              level={5}
              style={{ fontSize: '16px', margin: 0, lineHeight: '64px', color: 'lightgray' }}
              onClick={() => setIsModalOpen(true)}
            >
              <ProfileOutlined style={{ marginRight: '5px', fontSize: '16px' }} />

              {scopeObj.project && scopeProps.projectTitle}
              {scopeProps.datasetTitle ? ` / ${scopeProps.datasetTitle}` : ''}
            </Typography.Title>
          )}
          <ScopePickerModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </Space>

        <Space size={isSmallScreen ? 0 : 'small'}>
          {TRANSLATED && (
            <Button
              type="text"
              className="header-button"
              icon={<RiTranslate style={{ transform: 'translateY(1px)' }} />}
              onClick={changeLanguage}
            >
              {isSmallScreen ? '' : LNGS_FULL_NAMES[LNG_CHANGE[i18n.language]]}
            </Button>
          )}
          <Button type="text" className="header-button" icon={<LinkOutlined />} onClick={openPortalWindow}>
            {isSmallScreen ? '' : t('Portal')}
            {isSmallScreen || <ExportOutlined />}
          </Button>
          {isAuthenticated ? (
            <Button type="text" className="header-button" icon={<LogoutOutlined />} onClick={performSignOut}>
              {isSmallScreen ? '' : t('Sign Out')}
            </Button>
          ) : (
            <Button type="primary" shape="round" icon={<LoginOutlined />} onClick={performSignIn}>
              {openIdConfigFetching || isHandingOffCodeForToken ? t('Loading...') : isSmallScreen ? '' : t('Sign In')}
            </Button>
          )}
        </Space>
      </Flex>
    </Header>
  );
};

export default SiteHeader;
