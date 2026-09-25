import type { HTMLAttributes, ReactNode } from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useTranslationFn } from '@/hooks';
import { GenericDrawer } from '@Util/GenericDrawer';

/*
 * Structure:
 *   Sidebar
 *     SidebarSection (with title and possible extra header content)
 *       SidebarFacet
 *       SidebarFacet
 *       ...
 *     SidebarSection (with title and possible extra header content)
 *       ...
 */

type SidebarFacetProps = {
  headerId: string;
  label: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  children: ReactNode;
};

export const SidebarFacet = ({ headerId, label, collapsed, onToggleCollapse, children }: SidebarFacetProps) => {
  const t = useTranslationFn();

  return (
    <div className={clsx('sidebar-facet', !collapsed && 'sidebar-facet--expanded')}>
      <Typography.Title level={3} className="facet-head__title">
        <button
          className="facet-head focus-ring"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
          id={`catalogue-facet-${headerId}`}
          aria-controls={`catalogue-facet-region-${headerId}`}
          aria-label={`${label} , ${collapsed ? t('catalogue.rail.show_section') : t('catalogue.rail.hide_section')}`}
        >
          <span className="facet-head__label">{label}</span>
          {collapsed ? (
            <CaretRightOutlined className="facet-head__icon" aria-hidden="true" />
          ) : (
            <CaretDownOutlined className="facet-head__icon" aria-hidden="true" />
          )}
        </button>
      </Typography.Title>
      <div
        className={clsx('facet-chips-container', !collapsed && 'facet-chips-container--open')}
        aria-labelledby={`catalogue-facet-${headerId}`}
        id={`catalogue-facet-region-${headerId}`}
      >
        {/* Single grid item so the 0fr → 1fr collapse covers every child (e.g. search box + scrollable chips). */}
        <div className="facet-chips-container__inner">{children}</div>
      </div>
    </div>
  );
};

export type SidebarSectionProps = HTMLAttributes<HTMLElement> & {
  sectionTitle: ReactNode;
  extra?: ReactNode;
};

export const SidebarSection = ({ sectionTitle, extra, children, className, ...props }: SidebarSectionProps) => (
  <section className={clsx('sidebar-section', className)} {...props}>
    <header className="sidebar-section__header">
      <Typography.Title level={2} className="sidebar-section__header__title">
        {sectionTitle}
      </Typography.Title>
      {extra && <div className="sidebar-section__header__extra">{extra}</div>}
    </header>
    <div className="sidebar-section__content">{children}</div>
  </section>
);

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  footer?: ReactNode;
  /** Below some breakpoint, the sidebar renders as a fixed slide-over drawer instead of an inline sticky column. */
  overlay?: boolean;
  /** Ignored when `overlay` is falsy (the sidebar is always visible inline). */
  open?: boolean;
  onClose?: () => void;
  extra?: ReactNode;
};

const Sidebar = ({ children, footer, className, overlay, open, onClose, ...props }: SidebarProps) => (
  <>
    {overlay ? (
      <GenericDrawer
        open={open}
        onClose={onClose}
        drawerRender={() => <div className="drawer-content">{children}</div>}
      />
    ) : (
      <aside className={clsx('sidebar', className)} {...props}>
        <div className="sidebar__content">{children}</div>
        {footer && <footer className="sidebar__footer">{footer}</footer>}
      </aside>
    )}
  </>
);

export default Sidebar;
