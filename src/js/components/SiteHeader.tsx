import { Button, Divider, Flex, Layout, Menu, Space, Typography, theme } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from '@/features/auth/hooks';
import { useLangPrefixedUrl } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { getCurrentPage } from '@/utils/router';
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
import type { MenuItem } from '@/types/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useSearchQueryParams } from '@/features/search/hooks';
import { useLanguage, useTranslationFn } from '@/hooks';

const { Header } = Layout;

// dummy theme variable; in the future this could be used to do a 'dark mode' in combination with Ant's support
const THEME: 'light' | 'dark' = 'light';

// TODO: create LOGO_WIDTH env
const LOGO_WIDTH = 240;

type SiteHeaderProps = {
  menuItems?: MenuItem[];
};

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
  const rootUrl = useLangPrefixedUrl('');
  const buildMenuHref = useBuildMenuHref();

  const {
    token: { colorBgContainer, colorBorderSecondary },
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

  const navItems = hasMenu
    ? (menuItems ?? []).map((item) =>
        item && 'key' in item && item.key != null && item.type !== 'divider' && 'label' in item
          ? { ...item, label: <Link to={buildMenuHref(String(item.key))}>{item.label}</Link> }
          : item
      )
    : [];

  const newLang = LNG_CHANGE[language];

  return (
    <Header
      id="site-header"
      className={THEME}
      style={{ backgroundColor: colorBgContainer, borderBottom: `1px solid ${colorBorderSecondary}` }}
    >
      {/* Skip links */}
      <a className="site-header__skip-link" href="#main-content">
        {t('header.skip_links.main')}
      </a>
      <a className="site-header__skip-link" href="#site-footer">
        {t('header.skip_links.footer')}
      </a>

      <Flex align="center" justify="space-between" gap={isSmallScreen ? 'small' : 'large'} className="h-full">
        <Flex align="center" gap={isSmallScreen ? 'small' : 'large'} className="flex-1" style={{ minWidth: 0 }}>
          <Link to={rootUrl} aria-label={t('header.home')} className="site-header__home focus-ring">
            {SHOW_LOGO && (
              <Image
                src={logo}
                alt=""
                className="site-header__logo"
                height={LOGO_HEIGHT}
                width={LOGO_WIDTH}
                style={{ height: LOGO_HEIGHT, width: 'auto' }}
                priority
              />
            )}
            <Typography.Text
              className={clsx('site-header__title', !SHOW_HEADER_TITLE && 'visually-hidden')}
              aria-hidden
            >
              {t(CLIENT_NAME)}
            </Typography.Text>
          </Link>

          {hasMenu ? (
            <nav aria-label={t('header.nav')} className="flex-1" style={{ minWidth: 0 }}>
              <Menu mode="horizontal" className="site-header__nav" items={navItems} selectedKeys={[currentPage]} />
            </nav>
          ) : null}
        </Flex>

        <Space
          size={isSmallScreen ? 12 : 'middle'}
          separator={<Divider orientation="vertical" className="site-header__divider" aria-hidden />}
        >
          {TRANSLATED && (
            <Button
              htmlType="button"
              size="small"
              className="site-header__lang"
              lang={newLang}
              aria-label={LNGS_FULL_NAMES[newLang]}
              onClick={changeLanguage}
            >
              {isSmallScreen ? newLang.toUpperCase() : LNGS_FULL_NAMES[newLang]}
            </Button>
          )}

          {SHOW_SIGN_IN && <HeaderAuth />}
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

  const { data: sessionData } = useSession();
  const userName = sessionData?.user?.name?.trim() || undefined;
  const userEmail = sessionData?.user?.email?.trim() || undefined;

  // fancy session loader
  const [isSigningIn, setIsSigningIn] = useState(false);
  const signInLabel = isSigningIn ? t('Loading...') : t('Sign In');
  const handleSignIn = useCallback(() => {
    setIsSigningIn(true);
    performSignIn().catch(() => setIsSigningIn(false));
  }, [performSignIn]);

  // performSignOut() clears our session before it redirects to the identity provider to end its session too, so
  // isAuthenticated flips to false mid-callback - without this, the button would flash to "Sign In" and back before
  // the page actually navigates away.
  const [isSigningOut, setIsSigningOut] = useState(false);
  const handleSignOut = useCallback(() => {
    setIsSigningOut(true);
    performSignOut();
  }, [performSignOut]);

  // Authenticated case: show user info and menu or sing out button
  if (isAuthenticated || isSigningOut) {
    const primaryLabel = userName ?? userEmail;

    if (!primaryLabel || isSigningOut) {
      return (
        <Button
          aria-label={t('Sign Out')}
          htmlType="button"
          shape={isSmallScreen ? 'circle' : 'round'}
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

    const secondaryLabel = userName ? userEmail : undefined;

    const headerAuthItems: MenuItem[] = [
      {
        key: 'user',
        label: (
          <span className={clsx('site-header__user-text', isSmallScreen && 'visually-hidden')} aria-hidden>
            <span className="site-header__user-name">{primaryLabel}</span>
            {secondaryLabel && <span className="site-header__user-email">{secondaryLabel}</span>}
          </span>
        ),
        icon: <UserOutlined aria-hidden />,
        children: [
          {
            key: 'sign-out',
            icon: <LogoutOutlined aria-hidden />,
            label: <span aria-label={t('Sign Out')}>{t('Sign Out')}</span>,
          },
        ],
      },
    ];

    return (
      <Menu
        aria-label={t('header.userMenu.label')}
        mode="horizontal"
        className="site-header__user-menu"
        items={headerAuthItems}
        selectable={false}
        disabledOverflow
        triggerSubMenuAction="click"
        onClick={({ key }) => key === 'sign-out' && handleSignOut()}
      />
    );
  }

  return (
    <Button
      aria-label={signInLabel}
      htmlType="button"
      type="primary"
      shape={isSmallScreen ? 'circle' : 'round'}
      icon={<LoginOutlined aria-hidden />}
      onClick={handleSignIn}
      loading={isSigningIn}
      disabled={isSigningIn}
    >
      <span hidden={isSmallScreen} aria-hidden>
        {signInLabel}
      </span>
    </Button>
  );
};

export default SiteHeader;
