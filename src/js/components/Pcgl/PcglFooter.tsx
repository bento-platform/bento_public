import { Flex, Grid, Layout } from 'antd';
import { useTranslationFn } from '@/hooks';
import clsx from 'clsx';

const { Footer } = Layout;
const { useBreakpoint } = Grid;

const PcglFooter = () => {
  const t = useTranslationFn();
  const breakpoints = useBreakpoint();

  const links = [
    {
      key: 'contact',
      href: 'contactHref',
    },
    {
      key: 'policies',
    },
    {
      key: 'helpGuides',
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
    },
    {
      key: 'termsConditions',
    },
    {
      key: 'publicationPolicy',
    },
  ];

  return (
    <Footer id="pcgl-footer">
      <Flex align="center" gap={breakpoints.xl ? 48 : 24} vertical={!breakpoints.xl}>
        <Flex vertical={true} gap={16} className="flex-1">
          <Flex gap={breakpoints.md ? 48 : 8} vertical={!breakpoints.md}>
            <img
              src="/public/assets/pcgl_logo_footer.png"
              alt="Pan-Canadian Genome Library logo"
              style={{ width: 200 }}
            />
            <img
              src="/public/assets/cihr_logo_footer.png"
              alt="Canadian Institutes of Health Research logo"
              style={{ width: 260 }}
            />
          </Flex>
          <p>
            PCGL is supported by the Canadian Institutes of Health Research (CIHR).
            <br />
            &copy; 2019-2026 the Canadian Centre for Computational Genomics, McGill University.
          </p>
        </Flex>
        <div id="pcgl-footer__links" className={clsx({ 'w-full': !breakpoints.xl })}>
          {links.map((link) => (
            <a key={link.key} href={link.href ? t(`pcgl.links.${link.href}`) : '#'} rel="noreferrer" target="_blank">
              {t(`pcgl.links.${link.key}`)}
            </a>
          ))}
        </div>
      </Flex>
    </Footer>
  );
};

export default PcglFooter;
