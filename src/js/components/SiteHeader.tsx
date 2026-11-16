import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Image from 'next/image';

import clsx from 'clsx';
import { Button, Flex, Layout, Menu, Space, Typography, theme } from 'antd';
import { Header as PcglHeader, HeaderLanguageToggle, HeaderNavLink, HeaderUserMenu } from '@pcgl-components/ui/header';
import { useSession } from 'next-auth/react';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from '@/features/auth/hooks';

import { RiTranslate } from 'react-icons/ri';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

import { useNavigateToRoot } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { getCurrentPage } from '@/utils/router';

import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import {
  CLIENT_NAME,
  PCGL_MODE,
  SHOW_LOGO,
  SHOW_HEADER_TITLE,
  SHOW_SIGN_IN,
  TRANSLATED,
  TRANSLATED_LOGO,
  LOGO_HEIGHT,
} from '@/config';

import type { MenuItem } from '@/types/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useSearchQueryParams } from '@/features/search/hooks';
import { useLanguage, useTranslationFn } from '@/hooks';

import '@pcgl-components/ui/header/styles.css';

const { Header } = Layout;

// dummy theme variable; in the future this could be used to do a 'dark mode' in combination with Ant's support
const THEME: 'light' | 'dark' = 'light';

// TODO: create LOGO_WIDTH env
const LOGO_WIDTH = 240;

type SiteHeaderProps = {
  menuItems?: MenuItem[];
};
type NavMenuItem = { key: string | number; label?: ReactNode; icon?: ReactNode };

const isNavMenuItem = (item: MenuItem): item is MenuItem & NavMenuItem =>
  !!item && 'key' in item && item.key != null && item.type !== 'divider';

const useBuildMenuHref = () => {
  const location = useLocation();
  const exploreQueryParams = useSearchQueryParams();

  return useCallback(
    (key: string) => {
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
      // only include filter/search/explore query params if we're navigating to the explore page
      return buildQueryParamsUrl('/' + newPath.join('/'), key === BentoRoute.Explore ? exploreQueryParams : undefined);
    },
    [exploreQueryParams, location.pathname]
  );
};

const SiteHeader = ({ menuItems }: SiteHeaderProps) => {
  const t = useTranslationFn();
  const language = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useSmallScreen();
  const currentPage = getCurrentPage(location);
  const navigateToRoot = useNavigateToRoot();
  const buildMenuHref = useBuildMenuHref();

  const {
    token: { colorPrimary, colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  useEffect(() => {
    document.title = CLIENT_NAME && CLIENT_NAME.trim() ? t(CLIENT_NAME) : 'Bento';
  }, [t]);

  const changeLanguage = () => {
    const newLang = LNG_CHANGE[language];
    // Can't rely on there being a trailing slash at the base page (.e.g, `/en` and `/en`/ are both valid), and can't
    // ensure project IDs don't begin with an `en` or `fr`. Thus, we use a RegExp with a `^` for language changing in
    // the URL.
    const path = (location.pathname + location.search).replace(new RegExp(`^/${language}`), `/${newLang}`);
    navigate(path, { replace: true });
  };

  const logoLangPart = TRANSLATED_LOGO && language !== 'en' ? '.' + language : '';
  const logo = `/public/assets/branding${THEME === 'light' ? '.lightbg' : ''}${logoLangPart}.png`;

  const hasMenu = (menuItems?.length ?? 0) > 1;
  const headerStyle = { backgroundColor: colorBgContainer, borderBottom: `1px solid ${colorBorderSecondary}` };

  if (PCGL_MODE) {
    return (
      <PcglHeader
        brand={colorPrimary}
        translator={t}
        id="site-header"
        className={THEME}
        style={headerStyle}
        skipLinks={[
          { href: '#main-content', label: t('header.skip_links.main') },
          { href: '#pcgl-footer', label: t('header.skip_links.footer') },
        ]}
        logo={
          SHOW_LOGO ? (
            <Image
              src={logo}
              alt={CLIENT_NAME || 'Logo'}
              height={LOGO_HEIGHT}
              width={LOGO_WIDTH}
              style={{ height: LOGO_HEIGHT, width: 'auto' }}
              priority
            />
          ) : null
        }
        nav={
          hasMenu ? (
            <>
              {(menuItems ?? []).filter(isNavMenuItem).map(({ key, label, icon }) => {
                const k = String(key);
                const href = buildMenuHref(k);
                return (
                  <HeaderNavLink
                    key={k}
                    href={href}
                    current={k === currentPage}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                      e.preventDefault();
                      navigate(href);
                    }}
                  >
                    {icon}
                    {label}
                  </HeaderNavLink>
                );
              })}
            </>
          ) : undefined
        }
        language={
          TRANSLATED && (
            <HeaderLanguageToggle
              className="focus-ring"
              lang={language}
              shortLabel={LNG_CHANGE[language].toUpperCase()}
              onClick={changeLanguage}
            >
              {LNGS_FULL_NAMES[LNG_CHANGE[language]]}
            </HeaderLanguageToggle>
          )
        }
        account={<HeaderAuth />}
      />
    );
  }

  return (
    <Header id="site-header" className={THEME} style={headerStyle}>
      <Flex align="center" justify="space-between">
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
                <img
                  src={logo}
                  alt="logo"
                  aria-hidden
                  className="cursor-pointer"
                  style={{
                    height: LOGO_HEIGHT,
                    verticalAlign: 'middle',
                    transform: 'translateY(-3px)',
                  }}
                  onClick={navigateToRoot}
                />
              </object>
            ) : (
              <img
                src={logo}
                alt="logo"
                aria-hidden
                className="cursor-pointer"
                style={{
                  height: LOGO_HEIGHT,
                  verticalAlign: 'middle',
                  transform: 'translateY(-3px)',
                  paddingLeft: '4px',
                }}
                onClick={navigateToRoot}
              />
            ))}
          <Typography.Text
            type="secondary"
            className={clsx('site-header__title', !SHOW_HEADER_TITLE && 'visually-hidden')}
            style={{ whiteSpace: 'nowrap' }}
          >
            {t(CLIENT_NAME)}
          </Typography.Text>
          {hasMenu ? (
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={[currentPage]}
              onClick={({ key }) => navigate(buildMenuHref(key))}
              className="flex-1"
            />
          ) : null}
        </Flex>

        <Space size={isSmallScreen ? 4 : 'small'}>
          {TRANSLATED && (
            <Button
              htmlType="button"
              type="text"
              className="header-button"
              icon={<RiTranslate aria-hidden style={{ transform: 'translateY(1px)' }} />}
              onClick={changeLanguage}
            >
              {isSmallScreen ? '' : LNGS_FULL_NAMES[LNG_CHANGE[language]]}
            </Button>
          )}
          <HeaderAuth />
        </Space>
      </Flex>
    </Header>
  );
};

const HeaderAuth = () => {
  const t = useTranslationFn();
  const isSmallScreen = useSmallScreen();
  const isAuthenticated = useIsAuthenticated();
  const performSignIn = usePerformAuth();
  const performSignOut = usePerformSignOut();

  const { status: sessionStatus, data: sessionData } = useSession();
  const userName = sessionData?.user?.name?.trim() || undefined;
  const userEmail = sessionData?.user?.email?.trim() || undefined;

  // performSignOut() clears our session before it redirects to the identity provider to end its session too, so
  // isAuthenticated flips to false mid-callback - without this, the button would flash to "Sign In" and back before
  // the page actually navigates away.
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleSignOut = useCallback(() => {
    setIsSigningOut(true);
    performSignOut();
  }, [performSignOut]);

  if (!SHOW_SIGN_IN) return null;

  if (!PCGL_MODE) {
    return isAuthenticated || isSigningOut ? (
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
      <Button type="primary" shape="round" icon={<LoginOutlined aria-hidden />} onClick={performSignIn}>
        {sessionStatus === 'loading' ? t('Loading...') : isSmallScreen ? '' : t('Sign In')}
      </Button>
    );
  }

  if (isAuthenticated || isSigningOut) {
    const primaryLabel = userName ?? userEmail;

    if (!primaryLabel) {
      return (
        <Button
          aria-label={t('Sign Out')}
          htmlType="button"
          shape={isSmallScreen && !isSigningOut ? 'circle' : 'round'}
          icon={<LogoutOutlined aria-hidden />}
          loading={isSigningOut}
          onClick={handleSignOut}
        >
          <span hidden={isSmallScreen} aria-hidden>
            {t('Sign Out')}
          </span>
        </Button>
      );
    }

    return (
      <HeaderUserMenu className="focus-ring" name={primaryLabel} email={userName ? userEmail : undefined}>
        <Button
          htmlType="button"
          color="default"
          icon={<LogoutOutlined aria-hidden />}
          variant="text"
          block
          loading={isSigningOut}
          onClick={handleSignOut}
        >
          {t('Sign Out')}
        </Button>
      </HeaderUserMenu>
    );
  }

  return (
    <Button
      aria-label={sessionStatus === 'loading' ? t('Loading...') : t('Sign In')}
      htmlType="button"
      type="primary"
      shape={isSmallScreen && sessionStatus != 'loading' ? 'circle' : 'round'}
      icon={<LoginOutlined aria-hidden />}
      onClick={performSignIn}
    >
      <span hidden={isSmallScreen} aria-hidden>
        {sessionStatus === 'loading' ? t('Loading...') : t('Sign In')}
      </span>
    </Button>
  );
};

export default SiteHeader;
