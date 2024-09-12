import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button, Flex, Layout, Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuthState, useIsAuthenticated, useOpenIdConfig, usePerformAuth, usePerformSignOut } from 'bento-auth-js';

import { RiTranslate } from 'react-icons/ri';
import { ExportOutlined, LinkOutlined, LoginOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';

import { useAppSelector } from '@/hooks';
import { scopeToUrl } from '@/utils/router';

import { DEFAULT_TRANSLATION, LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { CLIENT_NAME, PORTAL_URL, TRANSLATED } from '@/config';

import ChooseProjectModal from '@/components/ChooseProjectModal';

const { Header } = Layout;

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

const SiteHeader = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();

  const { isFetching: openIdConfigFetching } = useOpenIdConfig();
  const { isHandingOffCodeForToken } = useAuthState();
  const { projects, selectedScope } = useAppSelector((state) => state.metadata);

  const scopeSelectionEnabled = useMemo(() => {
    // show the scope selection only if necessary
    const projectsCount = projects.length;
    return projectsCount > 0 && (projectsCount > 1 || projects[0]?.datasets.length > 1);
  }, [projects]);

  const scopeProps = useMemo(
    () => ({
      projectTitle: projects.find((project) => project.identifier === selectedScope.project)?.title,
      datasetTitle: selectedScope.dataset
        ? projects
            .find((project) => project.identifier === selectedScope.project)
            ?.datasets.find((dataset) => dataset.identifier === selectedScope.dataset)?.title
        : null,
    }),
    [projects, selectedScope]
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
    <Header style={{ position: 'fixed', width: '100%', zIndex: 100, top: 0 }}>
      <Flex align="center" justify="space-between">
        <Space size="middle">
          <img
            src="/public/assets/branding.png"
            alt="logo"
            style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)' }}
            onClick={() => navigate(`/${i18n.language}${scopeToUrl(selectedScope)}`)}
          />
          <Typography.Title
            level={1}
            style={{ fontSize: '24px', margin: 0, lineHeight: '64px', color: 'white' }}
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

              {selectedScope.project && scopeProps.projectTitle}
              {scopeProps.datasetTitle ? ` / ${scopeProps.datasetTitle}` : ''}
            </Typography.Title>
          )}
          <ChooseProjectModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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
