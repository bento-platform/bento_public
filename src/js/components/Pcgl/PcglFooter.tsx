import Image from 'next/image';
import { useTranslationFn } from '@/hooks';
import { ADMIN_URL, SHOW_ADMIN_LINK } from '@/config';

import FundersLogo from './assets/funders.png';
import PortalIcon from './assets/PCGL-BGPC.png';
import BentoLogo from './assets/bento.png';
import GPLLogo from './assets/gplv3.png';
import C3GLogo from './assets/c3g.png';
import './styles.css';

type FooterNavItem = { link: string; url: string };
type FooterNavItems = { title: string; items: FooterNavItem[] };
type LinkItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { url: string };

const FooterContainer = () => {
  //TODO: Could we get it from an API and sanitized the urls?
  const FOOTER_DATA = [
    {
      title: 'about',
      items: [
        { link: 'pcglWebsite', url: 'pcglWebsite' },
        { link: 'policies', url: 'policies' },
        { link: 'privacy', url: 'privacy' },
        { link: 'termsConditions', url: 'termsConditions' },
        { link: 'publicationPolicy', url: 'publicationPolicy' },
      ],
    },
    {
      title: 'resources',
      items: [
        { link: 'helpGuides', url: 'helpGuides' },
        { link: 'controlledDataUsers', url: 'controlledDataUsers' },
        { link: 'dataPlatform', url: 'dataPlatform' },
        { link: 'researchPlatform', url: 'researchPlatform' },
      ],
    },
    {
      title: 'connect',
      items: [
        { link: 'contact', url: 'contact' },
        { link: 'subscribe', url: 'subscribe' },
        { link: 'linkedin', url: 'linkedin' },
        { link: 'github', url: 'github' },
      ],
    },
  ];

  const t = useTranslationFn();

  const data = Array.from(FOOTER_DATA, (link) => ({
    title: t(`footer.sections.${link.title}`),
    items: link.items.map((item) => ({
      link: t(`footer.links.${item.link}`),
      url: t(`footer.urls.${item.url}`),
    })),
  }));

  return (
    <footer className="pcgl-footer">
      <>{renderContextualBand()}</>
      <div className="main-band">
        <FooterView sections={data} />
        <div className="meta">
          <LinkHeader>{t('footer.meta.funding_title')}</LinkHeader>
          <Image className="meta-logo" src={FundersLogo} role="presentation" alt="" width={423} height={95} />
          <p>{t('footer.meta.cihr_support')}</p>
        </div>
      </div>
      <BentoBand />
    </footer>
  );
};

const renderContextualBand = () => {
  return (
    <div className="contextual-band">
      <div className="contextual-logos">
        <Image src={PortalIcon} width={424} height={131} className="contextual-logo" alt="" />
      </div>
    </div>
  );
};

const BentoBand = () => {
  const t = useTranslationFn();

  return (
    <div className="bento-footer">
      <div className="about">
        <LinkHeader>{t('footer.bento.title')}</LinkHeader>
        <p>
          {t('footer.bento.powered_by')}{' '}
          <LinkItem url="https://bento-platform.github.io">
            <Image src={BentoLogo} width={288} height={68} className="bento-logo" alt={t('footer.bento.bento')} />
          </LinkItem>
        </p>
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

const LinkHeader = ({ children }: { children: React.ReactNode }) => <h3 className="title">{children}</h3>;

const FooterView = ({ sections }: { sections: FooterNavItems[] }) => {
  return (
    <>
      {sections.map((section) => (
        <dl key={section.title} className="links-section">
          <dt>{section.title}</dt>
          <dd className="group">
            <ul>
              {section.items.map((item) => (
                <li key={`${item.link}-${item.url}`} className="item">
                  <LinkItem url={item.url}>{item.link}</LinkItem>
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      ))}
    </>
  );
};

export default FooterContainer;
