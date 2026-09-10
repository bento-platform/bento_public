import { Flex, Grid, Layout, Typography } from 'antd';
import clsx from 'clsx';
import { useTranslationFn } from '@/hooks';
import { ADMIN_URL, SHOW_ADMIN_LINK, PCGL_MODE } from '@/config';

import './styles.css';
import PCGLLogo from './assets/logo-white.svg';
import FundersLogo from './assets/funders.svg';

const { Footer } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

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

const LinkHeader = ({ children }: { children: React.ReactNode }) => <h3 className="visually-hidden">{children}</h3>;

const LinkItem = ({ link, url }: { link: string; url: string }) => (
  <a className="focus-ring link-item" href={url} rel="noreferrer" target="_blank">
    {link}
  </a>
);

const FooterView = ({ sections }: { sections: FooterNavItems[] }) => {
  return (
    <nav className="container">
      {sections.map((section) => (
        <div key={section.title} className="section">
          <LinkHeader>{section.title}</LinkHeader>
          <ul className="group">
            {section.items.map((item) => (
              <li key={item.toString()} className="item">
                <LinkItem link={item.link} url={item.url} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
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
      <FooterView sections={data} />
      <div className="meta">
        <LinkHeader>{t('footer.meta.funding_title')}</LinkHeader>
        <div className="meta-logos" aria-hidden="true">
          <img src={PCGLLogo} role="presentation" alt="" width={515} height={185} />
          <img src={FundersLogo} role="presentation" alt="" width={423} height={99} />
        </div>
        <p>{t('footer.meta.cihr_support')}</p>
      </div>
    </footer>
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
