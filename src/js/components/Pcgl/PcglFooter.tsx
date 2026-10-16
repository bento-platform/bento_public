import Image from 'next/image';
import { useTranslationFn } from '@/hooks';
import { ADMIN_URL, SHOW_ADMIN_LINK } from '@/config';
import { FooterContainer } from '@repo/ui/footer';
import BentoLogo from './assets/bento.svg';
import GPLLogo from './assets/gplv3.svg';
import C3GLogo from './assets/c3g.png';
import './styles.css';

type LinkItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { url: string };

export const Footer = () => {
  const t = useTranslationFn();
  return <FooterContainer translator={t} PortalBand={<BentoBand />} />;
};

const BentoBand = () => {
  const t = useTranslationFn();

  return (
    <div className="bento-footer">
      <div className="about">
        <p>{t('footer.bento.powered_by')} </p>
        <LinkItem url="https://bento-platform.github.io">
          <Image src={BentoLogo} width={288} height={68} className="bento-logo" alt={t('footer.bento.bento')} />
        </LinkItem>
      </div>
      <ul className="links">
        <li>
          <LinkItem url="/public/terms.html">{t('footer.bento.terms_of_use')}</LinkItem>
        </li>
        <li>
          <LinkItem url="https://computationalgenomics.ca" aria-label={t('footer.c3g')}>
            C3G
          </LinkItem>
        </li>
        {SHOW_ADMIN_LINK && (
          <li>
            <LinkItem url={ADMIN_URL} aria-label={t('footer.admin_link_tooltip')}>
              {t('footer.bento.admin_link')}
            </LinkItem>
          </li>
        )}
      </ul>
      <p className="legal">
        <Image src={GPLLogo} className="gpl-logo" alt="" /> {t('footer.bento.licensed_under')}{' '}
        <LinkItem url="https://github.com/bento-platform/bento_public/blob/main/LICENSE">LGPLv3</LinkItem>
        {'. '}
        {t('footer.bento.source_available')} <LinkItem url="https://github.com/bento-platform">Github</LinkItem>.
      </p>
      <p className="c3g">
        <Image src={C3GLogo} className="c3g-logo" alt="" />
        <span>© C3G, {new Date().getFullYear()}</span>
      </p>
    </div>
  );
};

const LinkItem = ({ children, url, target, ...props }: LinkItemProps) => {
  const isExternal = url.startsWith('http');
  const linkTarget = target ?? (isExternal ? '_blank' : undefined);
  return (
    <a
      className="focus-ring link-item"
      href={url}
      target={linkTarget}
      rel={linkTarget === '_blank' ? 'noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export default Footer;
