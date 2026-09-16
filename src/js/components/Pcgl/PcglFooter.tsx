import { Flex, Grid, Layout, Typography } from 'antd';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';
import { ADMIN_URL, SHOW_ADMIN_LINK, PCGL_MODE } from '@/config';

import './styles.css';
import PCGLLogo from './assets/logo-white.svg';
import FundersLogo from './assets/funders.svg';
import PortalIcon from './assets/PCGL-BGPC.svg?react';
import BentoLogo from './assets/bento.svg?react';
import GPLLogo from './assets/gpl-v3-black.svg?react';
import C3GLogo from './assets/c3g.svg?react';

const { Footer } = Layout;
const { useBreakpoint } = Grid;

type FooterNavItem = { link: string; url: string };
type FooterNavItems = { title: string; items: FooterNavItem[] };
type FooterMetaItems = {
  funding_title: string;
  logo_alt: string;
  cihr_logo_alt: string;
  cihr_support: string;
  powered_by: string;
  bento: string;
};

const LinkHeader = ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>;

const LinkItem = ({ children, url }: { children: React.ReactNode; url: string }) => (
  <a className="focus-ring link-item" href={url} rel="noreferrer" target="_blank">
    {children}
  </a>
);

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

const FooterContainer = () => {
  //TODO: Could we get it from an API?
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
          <div className="meta-logos" aria-hidden="true">
            <img src={PCGLLogo} role="presentation" alt="" width={515} height={185} />
            <img src={FundersLogo} role="presentation" alt="" width={423} height={99} />
          </div>
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
      <div className="contextual-logos" aria-hidden="true">
        <PortalIcon className="contextual-logo" />
      </div>
    </div>
  );
};

const BentoBand = () => {
  const t = useTranslationFn();

  return (
    <div className="bento-footer">
      <div className="about">
        <h3 className="title">{t('footer.bento.title')}</h3>
        <p>
          {t('footer.bento.powered_by')}{' '}
          <LinkItem url="https://bento-platform.github.io" aria-label={t('footer.bento.bento')}>
            <BentoLogo className="bento-logo" aria-hidden />
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
        <GPLLogo className="gpl-logo" aria-hidden /> {t('footer.bento.licensed_under')}{' '}
        <LinkItem url="https://github.com/bento-platform/bento_public/blob/main/LICENSE">LGPLv3</LinkItem>
        {'. '}
        {t('footer.bento.source_available')} <LinkItem url="https://github.com/bento-platform">Github</LinkItem>.
      </p>
      <p className="c3g">
        <C3GLogo className="c3g-logo" aria-hidden />
        <span>© C3G, {new Date().getFullYear()}</span>
      </p>
    </div>
  );
};

export default FooterContainer;
