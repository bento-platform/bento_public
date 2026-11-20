import clsx from 'clsx';
import { Button, Menu } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from '@/features/auth/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import type { MenuItem } from '@/types/navigation';
import { useTranslationFn } from '@/hooks';
import { SHOW_SIGN_IN } from '@/config';

export const HeaderAuth = () => {
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
    performSignOut().catch(() => setIsSigningOut(false));
  }, [performSignOut]);

  if (!SHOW_SIGN_IN) return null;

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
          <span className={clsx('site-header__user-text', isSmallScreen && 'visually-hidden')}>
            <span className="site-header__user-name">{primaryLabel}</span>
            {secondaryLabel && <span className="site-header__user-email">{secondaryLabel}</span>}
          </span>
        ),
        icon: <UserOutlined aria-hidden />,
        children: [
          {
            key: 'sign-out',
            icon: <LogoutOutlined aria-hidden />,
            label: t('Sign Out'),
            danger: true,
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
      aria-label={t('Sign In')}
      htmlType="button"
      type="primary"
      shape={isSmallScreen ? 'circle' : 'round'}
      icon={<LoginOutlined aria-hidden />}
      onClick={handleSignIn}
      loading={isSigningIn}
      disabled={isSigningIn}
      aria-busy={isSigningIn}
    >
      <span hidden={isSmallScreen} aria-hidden>
        {t('Sign In')}
      </span>
    </Button>
  );
};
