import { type ReactNode, useEffect } from 'react';
import clsx from 'clsx';
import { Flex } from 'antd';
// import { useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

const PageHeader = ({ children, mode }: { children: ReactNode; mode: 'catalogue' | 'page' }) => {
  // const t = useTranslationFn();
  const catalogue = mode === 'catalogue';

  const isSmallScreen = useSmallScreen();

  useEffect(() => {
    if (catalogue) return; // no sticky header in catalogue mode
    const observer = new IntersectionObserver(
      ([e]) => {
        console.log('e.intersectionRatio', e.intersectionRatio);
        return e.target.toggleAttribute('data-stuck', e.intersectionRatio < 1);
      },
      { threshold: [1], root: document.getElementById('content-layout') }
    );

    const st = document.getElementById('page-header');

    if (st) {
      observer.observe(st);
    }

    return () => {
      observer.disconnect();
    };
  }, [catalogue]);

  return (
    <header
      id="page-header"
      className={clsx(`${mode}-mode`, { sticky: !catalogue, 'light-text': false })}
      // style={
      //   catalogue
      //     ? {
      //         background: 'url(https://genomelibrary.ca/wp-content/uploads/2024/11/banner-home.png)',
      //         backgroundPosition: 'center',
      //       }
      //     : {}
      // }
    >
      <Flex id="page-header__content" gap="middle" vertical={isSmallScreen}>
        <div className="flex-1">{children}</div>
        {/*TODO: catalogue stats*/}
        {/*{catalogue && (*/}
        {/*  <ul id="page-header-stats">*/}
        {/*    <li>*/}
        {/*      <strong>###</strong> {t('entities.dataset', { count: 2 })}*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <strong>###</strong> {t('entities.individual', { count: 2 })}*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <strong>###</strong> {t('entities.biosample', { count: 2 })}*/}
        {/*    </li>*/}
        {/*    <li>*/}
        {/*      <strong>###</strong> Whole Genomes*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*)}*/}
      </Flex>
    </header>
  );
};

export default PageHeader;
