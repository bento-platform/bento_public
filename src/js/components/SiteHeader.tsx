import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Flex, Layout, Menu, type MenuProps, Space, Typography, theme } from 'antd';
import { useSession } from 'next-auth/react';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from '@/features/auth/hooks';

import { RiTranslate } from 'react-icons/ri';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';

import { useNavigateToRoot } from '@/hooks/navigation';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { useCurrentPage, usePathnameNoLang } from '@/utils/router';

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

type OnClick = MenuProps['onClick'];
type SiteHeaderProps = {
  menuItems?: MenuItem[];
};

const useHandleMenuClick = (): OnClick => {
  const router = useAppRouter();
  const pathname = usePathnameNoLang();
  const exploreQueryParams = useSearchQueryParams();

  return useCallback(
    ({ key }: { key: string }) => {
      const currentPath = pathname.split('/').filter(Boolean);
      const newPath: string[] = [];
      if (!TOP_LEVEL_ONLY_ROUTES.includes(key)) {
        // Beacon network only works at the top scope level
        if (currentPath[0] === 'p') {
          newPath.push('p', currentPath[1]);
        } else if (currentPath[0] === 'd') {
          newPath.push('d', currentPath[1]);
        }
      }
      newPath.push(key);
      const newPathString = '/' + newPath.join('/');
      // Navigate to the menu item url
      //  - only include filter/search/explore query params if we're navigating to the explore page
      router.push(buildQueryParamsUrl(newPathString, key === BentoRoute.Explore ? exploreQueryParams : undefined));
    },
    [router, exploreQueryParams, pathname]
  );
};

const SiteHeader = ({ menuItems }: SiteHeaderProps) => {
  const t = useTranslationFn();
  const language = useLanguage();
  const isSmallScreen = useSmallScreen();
  const currentPage = useCurrentPage();
  const navigateToRoot = useNavigateToRoot();
  const router = useRouter();

  const { status: sessionStatus } = useSession();

  const isAuthenticated = useIsAuthenticated();
  const performSignOut = usePerformSignOut();
  const performSignIn = usePerformAuth();

  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  useEffect(() => {
    document.title = CLIENT_NAME && CLIENT_NAME.trim() ? t(CLIENT_NAME) : 'Bento';
  }, [t]);

  const changeLanguage = () => {
    const newLang = LNG_CHANGE[language];
    // Soft client-side navigation: AppShell syncs the active i18next language (already fully preloaded for
    // every supported language - see i18n.config.ts) and document.documentElement.lang from the URL's [lang]
    // param on every route change, so this doesn't need a full page reload to take effect.
    // Can't rely on there being a trailing slash at the base page (.e.g, `/en` and `/en`/ are both valid), and can't
    // ensure project IDs don't begin with an `en` or `fr`. Thus, we use a RegExp with a `^` for language changing in
    // the URL.
    const path = (window.location.pathname + window.location.search).replace(
      new RegExp(`^/${language}`),
      `/${newLang}`
    );
    router.push(path);
  };

  const logoLangPart = TRANSLATED_LOGO && language !== 'en' ? '.' + language : '';
  const logo = `/public/assets/branding${THEME === 'light' ? '.lightbg' : ''}${logoLangPart}.png`;

  const handleMenuClick = useHandleMenuClick();

  return (
    <Header
      id="site-header"
      className={THEME}
      style={{ backgroundColor: colorBgContainer, borderBottom: `1px solid ${colorBorderSecondary}` }}
    >
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
          {(menuItems?.length ?? 0) > 1 ? (
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={[currentPage]}
              onClick={handleMenuClick}
              className="flex-1"
            />
          ) : null}
        </Flex>

        <Space size={isSmallScreen ? 4 : 'small'}>
          {TRANSLATED && (
            <Button
              type="text"
              className="header-button"
              icon={<RiTranslate style={{ transform: 'translateY(1px)' }} />}
              onClick={changeLanguage}
            >
              {isSmallScreen ? '' : LNGS_FULL_NAMES[LNG_CHANGE[language]]}
            </Button>
          )}
          {SHOW_SIGN_IN &&
            (isAuthenticated ? (
              <Button
                color="default"
                className="header-button"
                icon={<LogoutOutlined />}
                shape="round"
                variant="filled"
                onClick={performSignOut}
              >
                {isSmallScreen ? '' : t('Sign Out')}
              </Button>
            ) : (
              <Button type="primary" shape="round" icon={<LoginOutlined />} onClick={performSignIn}>
                {sessionStatus === 'loading' ? t('Loading...') : isSmallScreen ? '' : t('Sign In')}
              </Button>
            ))}
        </Space>
      </Flex>
    </Header>
  );
};

export default SiteHeader;
