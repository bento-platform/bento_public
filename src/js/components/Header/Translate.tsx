import { Button } from 'antd';
import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { TRANSLATED } from '@/config';
import { useLanguage } from '@/hooks';
import { RiTranslate } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

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
      icon={<RiTranslate aria-hidden />}
      className="site-header__lang"
      lang={newLang}
      aria-label={LNGS_FULL_NAMES[newLang]}
      onClick={changeLanguage}
    >
      {isSmallScreen ? newLang.toUpperCase() : LNGS_FULL_NAMES[newLang]}
    </Button>
  ) : null;
};
