import Image, { type StaticImageData, type ImageProps } from 'next/image';
import { useLanguage } from '@/hooks';
import { LOGO_HEIGHT, SHOW_LOGO, TRANSLATED_LOGO } from '@/config';

import darkEnBranding from '/public/public/assets/branding.png';
import darkFrBranding from '/public/public/assets/branding.fr.png';
import lightEnBranding from '/public/public/assets/branding.lightbg.png';
import lightFrBranding from '/public/public/assets/branding.lightbg.fr.png';

type Theme = 'light' | 'dark';
type BrandingRegistry = Record<Theme, Record<string, StaticImageData>>;

const BRANDING_REGISTRY: BrandingRegistry = {
  light: {
    en: lightEnBranding,
    fr: lightFrBranding,
  },
  dark: {
    en: darkEnBranding,
    fr: darkFrBranding,
  },
};

type BrandLogoProps = Omit<ImageProps, 'src' | 'alt'> & { theme?: Theme };

export const BrandLogo = ({ theme = 'light', ...props }: BrandLogoProps) => {
  const language = useLanguage();

  if (!SHOW_LOGO) return null;

  const logo = BRANDING_REGISTRY[theme][TRANSLATED_LOGO ? language : 'en'];

  return (
    <Image
      {...props}
      className="site-header__logo"
      style={{ height: LOGO_HEIGHT, width: 'auto' }}
      src={logo}
      alt=""
      onError={(e) => console.error(e.target)}
      priority
    />
  );
};
