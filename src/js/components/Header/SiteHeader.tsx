import clsx from 'clsx';
import { RiTranslate } from 'react-icons/ri';
import { Button, Divider, Flex, Layout, Menu, Space, Typography, theme } from 'antd';
import { useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLangPrefixedUrl, useSiteMenuItems } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { getCurrentPage } from '@/utils/router';
import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { CLIENT_NAME, SHOW_HEADER_TITLE, TRANSLATED } from '@/config';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useSearchQueryParams } from '@/features/search/hooks';
import { useLanguage, useTranslationFn } from '@/hooks';
import { BrandLogo } from './BrandLogo';
import { HeaderAuth } from './HeaderAuth';

const { Header } = Layout;

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

const SiteHeader = () => {
  const t = useTranslationFn();
  const language = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useSmallScreen();
  const currentPage = getCurrentPage(location);
  const rootUrl = useLangPrefixedUrl('');
  const buildMenuHref = useBuildMenuHref();
  const [menuItems] = useSiteMenuItems();

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
          <Link to={rootUrl} className="site-header__home focus-ring">
            <BrandLogo src={''} alt={''} />
            <Typography.Text className={clsx('site-header__title', !SHOW_HEADER_TITLE && 'visually-hidden')}>
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
              icon={<RiTranslate aria-hidden style={{ transform: 'translateY(1px)' }} />}
              className="site-header__lang"
              lang={newLang}
              aria-label={LNGS_FULL_NAMES[newLang]}
              onClick={changeLanguage}
            >
              {isSmallScreen ? newLang.toUpperCase() : LNGS_FULL_NAMES[newLang]}
            </Button>
          )}

          <HeaderAuth />
        </Space>
      </Flex>
    </Header>
  );
};

export default SiteHeader;
