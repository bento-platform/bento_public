import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  Header,
  HeaderLanguageToggle,
  HeaderUserMenu,
  HeaderNavLink,
  type HeaderProps,
} from '@pcgl-components/ui/header';
import { Button, theme } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import Image from 'next/image';
import type { MenuItem } from '@/types/navigation';

import { useTranslationFn, useLanguage } from '@/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchQueryParams } from '@/features/search/hooks';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from '@/features/auth/hooks';
import '@pcgl-components/ui/header/styles.css';

import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { CLIENT_NAME, SHOW_LOGO, SHOW_SIGN_IN, TRANSLATED_LOGO, LOGO_HEIGHT, TRANSLATED } from '@/config';

import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { getCurrentPage } from '@/utils/router';
import { useSession } from 'next-auth/react';

export interface PCGLHeaderProps extends HeaderProps {
  menuItems: MenuItem[];
}
type NavMenuItem = { key: string | number; label?: ReactNode; icon?: ReactNode };

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

const isNavMenuItem = (item: MenuItem): item is MenuItem & NavMenuItem =>
  !!item && 'key' in item && item.key != null && item.type !== 'divider';

export const PCGLHeader = (props: PCGLHeaderProps) => {
  const t = useTranslationFn();
  const navigate = useNavigate();
  const language = useLanguage();
  const location = useLocation();
  const buildMenuHref = useBuildMenuHref();
  const currentPage = getCurrentPage(location);

  const { menuItems } = props;

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
  const shortLanguageLabel = language == 'en' ? 'FR' : 'EN';

  const logoLangPart = TRANSLATED_LOGO && language !== 'en' ? '.' + language : '';
  const logo = `/public/assets/branding.lightbg${logoLangPart}.png`;
  // TODO: create LOGO_WIDTH env
  const LOGO_WIDTH = 240;

  return (
    <Header
      brand={colorPrimary}
      translator={t}
      id="site-header"
      className="pcgl-header"
      style={{ backgroundColor: colorBgContainer, borderBottom: `1px solid ${colorBorderSecondary}` }}
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
        (menuItems?.length ?? 0) > 1 ? (
          <>
            {menuItems.filter(isNavMenuItem).map(({ key, label, icon }) => {
              const k = String(key);
              const href = buildMenuHref(k);
              return (
                <HeaderNavLink
                  key={k}
                  href={href}
                  current={k === currentPage}
                  onClick={(e) => {
                    // let ctrl/cmd/shift/middle-click open a new tab normally
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
            shortLabel={shortLanguageLabel}
            onClick={changeLanguage}
          >
            {LNGS_FULL_NAMES[LNG_CHANGE[language]]}
          </HeaderLanguageToggle>
        )
      }
      account={<HeaderAuth />}
    />
  );
};

const HeaderAuth = () => {
  const t = useTranslationFn();
  const isSmallScreen = useSmallScreen();
  const isAuthenticated = useIsAuthenticated();
  const performSignIn = usePerformAuth();
  const performSignOut = usePerformSignOut();

  // performSignOut() clears our session before it redirects to the identity provider to end its session too, so
  // isAuthenticated flips to false mid-callback - without this, the button would flash to "Sign In" and back before
  // the page actually navigates away.
  const userPlaceholder = { name: 'Nyan Cat', email: '' };
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { status: sessionStatus, data: sessionData } = useSession();
  const sessionUser = sessionData?.user ?? userPlaceholder;

  const handleSignOut = useCallback(() => {
    setIsSigningOut(true);
    performSignOut();
  }, [performSignOut]);

  if (!SHOW_SIGN_IN) return null;

  return isAuthenticated || isSigningOut ? (
    <HeaderUserMenu
      className="focus-ring"
      name={sessionUser.name ?? userPlaceholder.name}
      email={sessionUser.email ?? userPlaceholder.email}
    >
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
        {t('Sign Out')}
      </Button>
    </HeaderUserMenu>
  ) : (
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

export default PCGLHeader;
