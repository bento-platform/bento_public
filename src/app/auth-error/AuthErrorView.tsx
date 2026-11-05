'use client';

import { Button, Card, ConfigProvider, Flex, Typography } from 'antd';
import { CloseCircleFilled, ExclamationCircleFilled, LoginOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css';
import '../../styles.css';

// This page lives outside the /:lang router and the app doesn't persist its language, so rather than detecting one
// we show English and French together.
type Message = { title: string; description: string };
type Messages = { en: Message; fr: Message };

const CONTACT_EN =
  'If this keeps happening, please contact the administrator of this portal and mention the code below.';
const CONTACT_FR =
  'Si le problème persiste, veuillez communiquer avec l’administrateur de ce portail et mentionner le code ci-dessous.';

// Only errors that can actually happen with our OIDC-only setup. Auth.js's AccessDenied (needs a custom signIn callback
// returning false) and Verification (email magic links) can't occur here, so they fall through to the default message.
const OIDC_FAILURE: Messages = {
  en: {
    title: 'We couldn’t complete your sign-in',
    description: `The sign-in didn’t finish. Please try again. ${CONTACT_EN}`,
  },
  fr: {
    title: 'Nous n’avons pas pu terminer votre connexion',
    description: `La connexion n’a pas abouti. Veuillez réessayer. ${CONTACT_FR}`,
  },
};

const MESSAGES: Record<string, Messages> = {
  Configuration: {
    en: {
      title: 'We couldn’t sign you in',
      description: `This is a problem on our side, not with your account. Please try again in a few minutes. ${CONTACT_EN}`,
    },
    fr: {
      title: 'Nous n’avons pas pu vous connecter',
      description: `Le problème vient de notre côté, et non de votre compte. Veuillez réessayer dans quelques minutes. ${CONTACT_FR}`,
    },
  },
  OAuthSignin: OIDC_FAILURE,
  OAuthCallbackError: OIDC_FAILURE,
  Callback: OIDC_FAILURE,
};

const DEFAULT_MESSAGES: Messages = {
  en: {
    title: 'Something went wrong while signing you in',
    description: `Please try again. ${CONTACT_EN}`,
  },
  fr: {
    title: 'Une erreur s’est produite lors de votre connexion',
    description: `Veuillez réessayer. ${CONTACT_FR}`,
  },
};

const LABELS = {
  en: { retry: 'Try again', back: 'Go back', code: 'Error code' },
  fr: { retry: 'Réessayer', back: 'Retour', code: 'Code d’erreur' },
};

const GAP = 24; // same vertical gap between the icon, the English block and the French block

const AuthErrorView = ({
  code,
  retry,
  backHrefs,
}: {
  code?: string;
  retry: (lang: string) => Promise<void>;
  backHrefs: Record<string, string>;
}) => {
  const messages = (code && MESSAGES[code]) || DEFAULT_MESSAGES;
  const isError = code === 'Configuration';
  const Icon = isError ? CloseCircleFilled : ExclamationCircleFilled;

  const renderLanguage = (lang: 'en' | 'fr') => (
    <Flex vertical align="center" gap={12} style={{ textAlign: 'center' }} lang={lang}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {messages[lang].title}
      </Typography.Title>
      <Typography.Text type="secondary">{messages[lang].description}</Typography.Text>
      <Flex gap={8} wrap justify="center">
        <form action={retry.bind(null, lang)}>
          <Button type="primary" htmlType="submit" icon={<LoginOutlined aria-hidden />}>
            {LABELS[lang].retry}
          </Button>
        </form>
        <Button href={backHrefs[lang]}>{LABELS[lang].back}</Button>
      </Flex>
    </Flex>
  );

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
          <Flex vertical align="center" gap={GAP}>
            <Icon aria-hidden style={{ fontSize: 56, color: isError ? '#ff4d4f' : '#faad14' }} />
            {renderLanguage('en')}
            {renderLanguage('fr')}
            {code && (
              <Typography.Text type="secondary">
                {LABELS.en.code} / {LABELS.fr.code}: <Typography.Text code>{code}</Typography.Text>
              </Typography.Text>
            )}
          </Flex>
        </Card>
      </Flex>
    </ConfigProvider>
  );
};

export default AuthErrorView;
