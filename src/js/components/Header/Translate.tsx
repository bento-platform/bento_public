import { Button } from 'antd';
import { type SVGProps } from 'react';
import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { TRANSLATED } from '@/config';
import { useLanguage } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

const TranslateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden
    focusable={false}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

export const LanguageControl = () => {
  const language = useLanguage();
  const navigate = useNavigate();
  const isSmallScreen = useSmallScreen();

  const changeLanguage = () => {
    const newLang = LNG_CHANGE[language];
    // Can't rely on there being a trailing slash at the base page (.e.g, `/en` and `/en`/ are both valid), and can't
    // ensure project IDs don't begin with an `en` or `fr`. Thus, we use a RegExp with a `^` for language changing in
    // the URL.
    const path = (location.pathname + location.search).replace(new RegExp(`^/${language}`), `/${newLang}`);
    navigate(path, { replace: true });
  };
  const newLang = LNG_CHANGE[language];

  return TRANSLATED ? (
    <Button
      htmlType="button"
      icon={<TranslateIcon />}
      className="site-header__lang"
      lang={newLang}
      aria-label={LNGS_FULL_NAMES[newLang]}
      onClick={changeLanguage}
    >
      {isSmallScreen ? newLang.toUpperCase() : LNGS_FULL_NAMES[newLang]}
    </Button>
  ) : null;
};
