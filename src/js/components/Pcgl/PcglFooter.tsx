import { Flex, Grid, Layout, Typography } from 'antd';
import { useTranslationFn } from '@/hooks';
import clsx from 'clsx';
import { ADMIN_URL, SHOW_ADMIN_LINK, PCGL_MODE } from '@/config';
import { useId } from 'react';

const { Footer } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

type FooterNavItem = { link: string; url: string };
type FooterNavItems = { title: string; items: FooterNavItem[] };

const LinkHeader = ({ children }: { children: React.ReactNode }) => <Title level={3}>{children}</Title>;

const LinkItem = ({ link, url }: { link: string; url: string }) => (
  <a className="focus-ring" href={url} rel="noreferrer" target="_blank">
    {link}
  </a>
);

const FooterView = ({ sections }: { sections: FooterNavItems[] }) => {
  const key = useId();
  return (
    <nav>
      {sections.map((section) => (
        <div key={section.title}>
          <LinkHeader>{section.title}</LinkHeader>
          <ul>
            {section.items.map((item) => (
              <li key={key}>
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
  //TODO: FOOTER_DATA: Could we get it from an API?
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
    title: t(`pcgl.footer.sections.${link.title}`),
    items: link.items.map((item) => ({
      link: t(`pcgl.footer.urls.${item.link}`),
      url: t(`pcgl.footer.links.${item.url}`),
    })),
  }));

  return <FooterView sections={data} />;
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

export default PcglFooter;
