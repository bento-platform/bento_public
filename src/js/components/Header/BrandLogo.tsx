import Image, { type StaticImageData, type ImageProps } from 'next/image';
import { useLanguage } from '@/hooks';
import { LOGO_HEIGHT, SHOW_LOGO } from '@/config';

import defaultBranding from '/public/public/assets/branding.png';
import frBranding from '/public/public/assets/branding.fr.png';
import lightEnBranding from '/public/public/assets/branding.lightbg.png';
import lightFrBranding from '/public/public/assets/branding.lightbg.fr.png';

type BrandingRegistry = Record<string, Record<string, StaticImageData>>;

const imageRegistry: BrandingRegistry = {
  light: {
    en: lightEnBranding,
    fr: lightFrBranding,
  },
  default: {
    en: defaultBranding,
    fr: frBranding,
  },
};

export const getBrandLogo = (lang: string, theme: string): StaticImageData =>
  imageRegistry[theme][lang] ?? defaultBranding;

export const BrandLogo = ({ ...props }: ImageProps) => {
  const language = useLanguage();

  if (!SHOW_LOGO) return null;

  const THEME: 'light' | 'dark' = 'light';
  const logo = getBrandLogo(language, THEME);

  return (
    <Image
      {...props}
      className="site-header__logo"
      style={{ height: LOGO_HEIGHT, width: 'auto' }}
      src={logo ?? defaultBranding}
      alt=""
      onError={(e) => console.error(e.target)}
      priority
    />
  );
};
