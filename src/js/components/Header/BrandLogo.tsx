import Image, { type ImageProps } from 'next/image';
import { useLanguage } from '@/hooks';
import { LOGO_HEIGHT, SHOW_LOGO, TRANSLATED_LOGO } from '@/config';

type Theme = 'light' | 'dark';
type BrandingRegistry = Record<Theme, Record<string, string>>;

const BRANDING_REGISTRY: BrandingRegistry = {
  light: {
    en: '/public/assets/branding.lightbg.png',
    fr: '/public/assets/branding.lightbg.fr.png',
  },
  dark: {
    en: '/public/assets/branding.png',
    fr: '/public/assets/branding.fr.png',
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
