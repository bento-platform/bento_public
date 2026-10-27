import { useCallback, useEffect, useState } from 'react';
import { Header, type HeaderProps } from '@repo/ui/header';
import { Button, Flex, Menu, type MenuProps, Space, Typography, theme } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { RiTranslate } from 'react-icons/ri';
import Image from 'next/image';
import type { MenuItem } from '@/types/navigation';

import { useTranslationFn, useLanguage } from '@/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchQueryParams } from '@/features/search/hooks';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from '@/features/auth/hooks';
import '@repo/ui/styles.css';

import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import {
  CLIENT_NAME,
  SHOW_LOGO,
  SHOW_HEADER_TITLE,
  SHOW_SIGN_IN,
  TRANSLATED,
  TRANSLATED_LOGO,
  LOGO_HEIGHT,
} from '@/config';

import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { getCurrentPage } from '@/utils/router';
import { useNavigateToRoot } from '@/hooks/navigation';
import { useSession } from 'next-auth/react';

export interface PCGLHeaderProps extends HeaderProps {
  menuItems: MenuItem[];
}

type OnClick = MenuProps['onClick'];

const useHandleMenuClick = (): OnClick => {
  const navigate = useNavigate();
  const location = useLocation();
  const exploreQueryParams = useSearchQueryParams();

  return useCallback(
    ({ key }: { key: string }) => {
      const currentPath = location.pathname.split('/').filter(Boolean);
      const newPath = [currentPath[0]];
      if (!TOP_LEVEL_ONLY_ROUTES.includes(key)) {
        // Beacon network only works at the top scope level
        if (currentPath[1] === 'p') {
          newPath.push('p', currentPath[2]);
        } else if (currentPath[1] === 'd') {
          newPath.push('d', currentPath[2]);
        }
      }
      newPath.push(key);
      const newPathString = '/' + newPath.join('/');
      // Navigate to the menu item url
      //  - only include filter/search/explore query params if we're navigating to the explore page
      navigate(buildQueryParamsUrl(newPathString, key === BentoRoute.Explore ? exploreQueryParams : undefined));
    },
    [navigate, exploreQueryParams, location.pathname]
  );
};

export const PCGLHeader = (props: PCGLHeaderProps) => {
  const t = useTranslationFn();
  const language = useLanguage();
  const location = useLocation();
  const isSmallScreen = useSmallScreen();
  const currentPage = getCurrentPage(location);
  const navigateToRoot = useNavigateToRoot();

  const { menuItems } = props;

  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  useEffect(() => {
    document.title = CLIENT_NAME && CLIENT_NAME.trim() ? t(CLIENT_NAME) : 'Bento';
  }, [t]);

  const logoLangPart = TRANSLATED_LOGO && language !== 'en' ? '.' + language : '';
  const logo = `/public/assets/branding.lightbg${logoLangPart}.png`;

  const handleMenuClick = useHandleMenuClick();

  return (
    <Header
      id="site-header"
      style={{
        backgroundColor: colorBgContainer,
        borderBottom: `1px solid ${colorBorderSecondary}`,
      }}
      skipLinks={[
        { href: '#main', label: t('header.skip_links.main') },
        { href: '#footer', label: t('header.skip_links.footer') },
      ]}
      ImageLogo={
        <Flex align="center" gap={isSmallScreen ? 'small' : 'middle'} className="flex-1">
          {SHOW_LOGO &&
            (isSmallScreen ? (
              <object
                type="image/png"
                data={logo}
                aria-hidden
                style={{ height: LOGO_HEIGHT, verticalAlign: 'middle', transform: 'translateY(-3px)', paddingRight: 3 }}
                onClick={navigateToRoot}
              >
                <Image
                  src={logo}
                  alt="logo"
                  aria-hidden
                  className="cursor-pointer"
                  height={LOGO_HEIGHT}
                  width={300}
                  style={{
                    height: LOGO_HEIGHT,
                    verticalAlign: 'middle',
                    transform: 'translateY(-3px)',
                  }}
                  onClick={navigateToRoot}
                />
              </object>
            ) : (
              <Image
                src={logo}
                alt="logo"
                aria-hidden
                className="cursor-pointer"
                height={LOGO_HEIGHT}
                width={180}
                style={{
                  height: LOGO_HEIGHT,
                  verticalAlign: 'middle',
                  transform: 'translateY(-3px)',
                  paddingLeft: '4px',
                }}
                onClick={navigateToRoot}
              />
            ))}
          {/* If SHOW_HEADER_TITLE is false, assume we have text in the logo. We should still have some kind of level-1
              header for accessibility/semantic markup, so render it but visually hidden in this case. */}
          <Typography.Title
            level={1}
            type="secondary"
            className={SHOW_HEADER_TITLE ? '' : 'visually-hidden'}
            style={{ whiteSpace: 'nowrap' }}
          >
            {t(CLIENT_NAME)}
          </Typography.Title>
        </Flex>
      }
      MenuOptions={
        (menuItems?.length ?? 0) > 1 ? (
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={[currentPage]}
            onClick={handleMenuClick}
            className="flex-1"
          />
        ) : null
      }
      /** TODO: get the real user name */
      auth={{ user: { name: 'username' } }}
      AuthenticationComponent={HeaderTail}
    />
  );
};

const HeaderTail = () => {
  const t = useTranslationFn();
  const isSmallScreen = useSmallScreen();
  const isAuthenticated = useIsAuthenticated();
  const performSignIn = usePerformAuth();
  const performSignOut = usePerformSignOut();

  // performSignOut() clears our session before it redirects to the identity provider to end its session too, so
  // isAuthenticated flips to false mid-callback - without this, the button would flash to "Sign In" and back before
  // the page actually navigates away.
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { status: sessionStatus } = useSession();

  const handleSignOut = useCallback(() => {
    setIsSigningOut(true);
    performSignOut();
  }, [performSignOut]);

  const navigate = useNavigate();
  const language = useLanguage();
  const changeLanguage = () => {
    const newLang = LNG_CHANGE[language];
    // Can't rely on there being a trailing slash at the base page (.e.g, `/en` and `/en`/ are both valid), and can't
    // ensure project IDs don't begin with an `en` or `fr`. Thus, we use a RegExp with a `^` for language changing in
    // the URL.
    const path = (location.pathname + location.search).replace(new RegExp(`^/${language}`), `/${newLang}`);
    navigate(path, { replace: true });
  };

  return (
    <Flex align="center" justify="space-between">
      <Space size={isSmallScreen ? 4 : 'small'}>
        {TRANSLATED && (
          <Button
            type="text"
            className="header-button"
            icon={<RiTranslate aria-hidden style={{ transform: 'translateY(1px)' }} />}
            onClick={changeLanguage}
          >
            {isSmallScreen ? '' : LNGS_FULL_NAMES[LNG_CHANGE[language]]}
          </Button>
        )}
      </Space>
      {SHOW_SIGN_IN &&
        (isAuthenticated || isSigningOut ? (
          <Button
            htmlType="button"
            color="default"
            className="header-button"
            icon={<LogoutOutlined aria-hidden />}
            shape="round"
            variant="filled"
            loading={isSigningOut}
            onClick={handleSignOut}
          >
            {isSmallScreen ? '' : t('Sign Out')}
          </Button>
        ) : (
          <Button
            htmlType="button"
            type="primary"
            shape="round"
            icon={<LoginOutlined aria-hidden />}
            onClick={performSignIn}
          >
            {sessionStatus === 'loading' ? t('Loading...') : isSmallScreen ? '' : t('Sign In')}
          </Button>
        ))}
    </Flex>
  );
};

export default PCGLHeader;
