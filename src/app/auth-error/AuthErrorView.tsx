'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, ConfigProvider, Flex, Result, Typography } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css';
import '../../styles.css';
import i18n from '@/i18n';
import { SUPPORTED_LNGS } from '@/constants/configConstants';

const KNOWN_CODES = ['Configuration', 'AccessDenied', 'Verification'];

const AuthErrorView = ({ code, retry }: { code?: string; retry: () => Promise<void> }) => {
  const { t } = useTranslation();
  const known = code && KNOWN_CODES.includes(code) ? code : undefined;
  const title = t(known ? `errors.auth_error.${known}.title` : 'errors.auth_error.title_default');
  const description = t(known ? `errors.auth_error.${known}.description` : 'errors.auth_error.description_default');

  // The root <html lang> is hardcoded, so the detector always picks English. This page lives outside the
  // /:lang router and the app doesn't persist its language, so use ?lng=, else the browser's language (like LanguageHandler).
  useEffect(() => {
    const lng = new URLSearchParams(window.location.search).get('lng') ?? navigator.language.split('-')[0];
    if (Object.values(SUPPORTED_LNGS).includes(lng)) i18n.changeLanguage(lng);
  }, []);

  return (
    <ConfigProvider theme={{ cssVar: { key: 'bento-theme' }, token: { colorPrimary: '#0958D9' } }}>
      <Flex vertical align="center" justify="center" style={{ minHeight: '100vh', padding: 16, background: '#f5f5f5' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/public/assets/branding.lightbg.png"
          alt="Bento"
          style={{ height: 40, marginBottom: 24 }}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        <Card className="rounded-xl shadow" style={{ maxWidth: 640, width: '100%' }}>
          <Result
            status={code === 'Configuration' ? 'error' : 'warning'}
            title={title}
            subTitle={description}
            extra={
              <Flex vertical align="center" gap={16}>
                <Flex gap={8}>
                  <form action={retry}>
                    <Button type="primary" htmlType="submit" icon={<LoginOutlined aria-hidden />}>
                      {t('errors.auth_error.try_again')}
                    </Button>
                  </form>
                  <Button href="/">{t('errors.auth_error.back_home')}</Button>
                </Flex>
                {code && (
                  <Typography.Text type="secondary">
                    {t('errors.auth_error.error_code')}: <Typography.Text code>{code}</Typography.Text>
                  </Typography.Text>
                )}
              </Flex>
            }
          />
        </Card>
      </Flex>
    </ConfigProvider>
  );
};

export default AuthErrorView;
