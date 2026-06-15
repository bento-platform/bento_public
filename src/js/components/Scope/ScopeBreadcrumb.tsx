import { useEffect } from 'react';
import { Button, Flex } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';

import ScopedTitle from '@/components/Scope/ScopedTitle';

type ScopeBreadcrumbProps = {
  showSidebarToggle: boolean;
  sidebarOverlayShown: boolean;
  onToggleSidebar: () => void;
  breadcrumbItems: BreadcrumbItemType[];
};

const ScopeBreadcrumb = ({
  showSidebarToggle,
  sidebarOverlayShown,
  onToggleSidebar,
  breadcrumbItems,
}: ScopeBreadcrumbProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => e.target.toggleAttribute('data-stuck', e.intersectionRatio < 1),
      { threshold: [1], root: document.getElementById('content-layout') }
    );
    const el = document.getElementById('scope-breadcrumb');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header id="scope-breadcrumb" style={{ paddingLeft: showSidebarToggle ? undefined : 'var(--content-padding-h)' }}>
      <Flex>
        {showSidebarToggle && (
          <Button
            id="scope-breadcrumb__sidebar-toggle"
            className={sidebarOverlayShown ? 'active' : ''}
            icon={<FilterOutlined />}
            color="default"
            variant="filled"
            size="large"
            onMouseDown={onToggleSidebar}
          />
        )}
        <ScopedTitle breadcrumbItems={breadcrumbItems} />
      </Flex>
    </header>
  );
};

export default ScopeBreadcrumb;
