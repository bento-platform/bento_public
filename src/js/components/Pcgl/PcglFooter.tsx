import Image from 'next/image';
import { useTranslationFn } from '@/hooks';
import { ADMIN_URL, SHOW_ADMIN_LINK } from '@/config';
import { FooterContainer, LinkItem } from '@pcgl-components/ui/footer';
import BentoLogo from './assets/bento.svg';
import GPLLogo from './assets/gplv3.svg';
import C3GLogo from './assets/c3g.png';
import './styles.css';

// Given that we don't have some of the data in the moment we define a temporary data
const footerItems = [
  {
    title: 'about',
    items: [
      { label: 'pcglWebsite', href: 'pcglWebsite' },
      { label: 'publicationPolicy', href: 'publicationPolicy' },
      { label: 'helpGuides', href: 'helpGuides' },
    ],
  },
  {
    title: 'connect',
    items: [
      { label: 'contact', href: 'contact' },
      { label: 'subscribe', href: 'subscribe' },
      { label: 'linkedin', href: 'linkedin' },
    ],
  },
];

export const Footer = () => {
  const t = useTranslationFn();
  return (
    <FooterContainer className="pcgl-layout-wrap" translator={t} PortalBand={<BentoBand />} footerItems={footerItems} />
  );
};

const BentoBand = () => {
  const t = useTranslationFn();

  return (
    <div className="bento-footer">
      <div className="about">
        <p>{t('footer.bento.powered_by')} </p>
        <LinkItem href="https://bento-platform.github.io">
          <Image src={BentoLogo} width={288} height={68} className="bento-logo" alt={t('footer.bento.bento')} />
        </LinkItem>
      </div>
      <ul className="links">
        <li>
          <LinkItem href="/public/terms.html">{t('footer.bento.terms_of_use')}</LinkItem>
        </li>
        <li>
          <LinkItem href="https://computationalgenomics.ca" aria-label={t('footer.c3g')}>
            C3G
          </LinkItem>
        </li>
        {SHOW_ADMIN_LINK && (
          <li>
            <LinkItem href={ADMIN_URL} aria-label={t('footer.admin_link_tooltip')}>
              {t('footer.bento.admin_link')}
            </LinkItem>
          </li>
        )}
      </ul>
      <p className="legal">
        <Image src={GPLLogo} className="gpl-logo" alt="" /> {t('footer.bento.licensed_under')}{' '}
        <LinkItem href="https://github.com/bento-platform/bento_public/blob/main/LICENSE">LGPLv3</LinkItem>
        {'. '}
        {t('footer.bento.source_available')} <LinkItem href="https://github.com/bento-platform">Github</LinkItem>.
      </p>
      <p className="c3g">
        <Image src={C3GLogo} className="c3g-logo" alt="" />
        <span>© C3G, {new Date().getFullYear()}</span>
      </p>
    </div>
  );
};

export default Footer;
