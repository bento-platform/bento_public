import { Flex, Grid, Layout, Typography } from 'antd';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';
import { ADMIN_URL, SHOW_ADMIN_LINK, PCGL_MODE } from '@/config';

import './styles.css';
import PCGLLogo from './assets/logo-white.svg';
import FundersLogo from './assets/funders.svg';
import PortalIcon from './assets/PCGL-BGPC.svg?react';

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

const LinkItem = ({ link, url }: { link: string; url: string }) => (
  <a className="focus-ring link-item" href={url} rel="noreferrer" target="_blank">
    {link}
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
                  <LinkItem link={item.link} url={item.url} />
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
      <>{renderBentoBand()}</>
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

const renderBentoBand = () => {
  return (
    <div>
      <div>
        <div>
          <h5>Powered by</h5>
          <a href="https://bento-platform.github.io" target="_blank" rel="noopener noreferrer">
            <img src="/30f9fc937de6d4ba1ff955bfb72a1b43.svg" alt="Bento" />
          </a>
        </div>
        <div>
          <span>
            Copyright © 2019-2026 <a href="https://computationalgenomics.ca" target="_blank" rel="noopener noreferrer">
              the Canadian Centre for Computational Genomics
            </a>.
          </span>
          <br />
          <span>
            Bento is licensed under the <a href="https://github.com/bento-platform/bento_public/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">LGPLv3</a>. The source code is available on <a href="https://github.com/bento-platform" target="_blank" rel="noopener noreferrer">Github</a>.
          </span>
        </div>
        <div>
          <a href="/public/terms.html" target="_blank" rel="noopener noreferrer">
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  );
};

const PCGL_LINKS: { key: string; href?: string }[] = [
  {
    key: 'contact',
    href: 'contactHref',
  },
  {
    key: 'policies',
  },
  {
    key: 'helpGuides',
    href: 'helpGuidesHref',
  },
  {
    key: 'controlledDataUsers',
  },
  {
    key: 'pcglWebsite',
    href: 'pcglWebsiteHref',
  },
  {
    key: 'dataPlatform',
  },
  {
    key: 'privacy',
    href: 'privacyHref',
  },
  {
    key: 'termsConditions',
    href: 'termsHref',
  },
  {
    key: 'publicationPolicy',
  },
  ...(SHOW_ADMIN_LINK
    ? [
      {
        key: 'admin',
          href: ADMIN_URL,
      },
    ]
    : []),
];

const PcglFooter = () => {
  const t = useTranslationFn();
  const breakpoints = useBreakpoint();

  return (
    <Footer id="pcgl-footer">
      <Flex align="center" gap={breakpoints.xl ? 48 : 24} vertical={!breakpoints.xl}>
        <Flex vertical={true} gap={16} className="flex-1">
          <Flex gap={breakpoints.md ? 48 : 8} vertical={!breakpoints.md}>
            <a href={t('pcgl.links.pcglWebsiteHref')} rel="noreferrer" target="_blank">
              <img src="/public/assets/pcgl_logo_footer.png" alt={t('pcgl.footer.logo_alt')} style={{ width: 200 }} />
            </a>
            <a href={t('pcgl.links.cihrHref')} rel="noreferrer" target="_blank">
              <img
                src="/public/assets/cihr_logo_footer.png"
                alt={t('pcgl.footer.cihr_logo_alt')}
                style={{ width: 260 }}
              />
            </a>
          </Flex>
          <h2>{t('pcgl.footer.meta.funding_title')}</h2>
          <p style={{ marginBottom: 0 }}>
            {t('pcgl.footer.cihr_support')}
            <br />
            {t('pcgl.footer.powered_by')}{' '}
            <a href="https://github.com/bento-platform/bento" rel="noreferrer" target="_blank">
              {t('pcgl.footer.bento')}
            </a>
            .<br />
            {t('footer.copyright')} 2019-{new Date().getFullYear()}{' '}
            <a href="https://computationalgenomics.ca" rel="noreferrer" target="_blank">
              {t('footer.c3g')}
            </a>
            .
          </p>
        </Flex>
        <div id="pcgl-footer__links" className={clsx({ 'w-full': !breakpoints.xl })}>
          {PCGL_LINKS.map((link) => (
            <a
              key={link.key}
              className={clsx({ disabled: !link.href })}
              aria-hidden={!link.href}
              // If the link href is an actual URL rather than a translation key, render the href directly.
              // Otherwise, look up the href using the translation function.
              href={link.href ? (link.href.startsWith('http') ? link.href : t(`pcgl.links.${link.href}`)) : undefined}
              rel="noreferrer"
              target="_blank"
            >
              {t(`pcgl.links.${link.key}`)}
            </a>
          ))}
        </div>
      </Flex>
    </Footer>
  );
};

export default FooterContainer;
