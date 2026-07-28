import type { HTMLAttributes, ReactNode } from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';

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

export const SidebarFacet = ({
  label,
  collapsed,
  onToggleCollapse,
  children,
}: {
  label: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  children: ReactNode;
}) => (
  <div className={clsx('sidebar-facet', !collapsed && 'sidebar-facet--expanded')}>
    <button className="facet-head" onClick={onToggleCollapse}>
      <span className="facet-head__label">{label}</span>
      {collapsed ? (
        <CaretRightOutlined className="facet-head__icon" />
      ) : (
        <CaretDownOutlined className="facet-head__icon" />
      )}
    </button>
    {!collapsed && children}
  </div>
);

export type SidebarSectionProps = HTMLAttributes<HTMLElement> & {
  sectionTitle: ReactNode;
  extra?: ReactNode;
};

export const SidebarSection = ({ sectionTitle, extra, children, className, ...props }: SidebarSectionProps) => (
  <section className={clsx('sidebar-section', className)} {...props}>
    <header className="sidebar-section__header">
      <Typography.Title level={3} className="sidebar-section__header__title">
        {sectionTitle}
      </Typography.Title>
      {extra && <div className="sidebar-section__header__extra">{extra}</div>}
    </header>
    <div className="sidebar-section__content">{children}</div>
  </section>
);

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  width?: string | number;
  /** Below some breakpoint, the sidebar renders as a fixed slide-over drawer instead of an inline sticky column. */
  overlay?: boolean;
  /** Ignored when `overlay` is falsy (the sidebar is always visible inline). */
  open?: boolean;
  onClose?: () => void;
};

const Sidebar = ({ children, className, overlay, open, onClose, ...props }: SidebarProps) => (
  <>
    {overlay && open && <div className="sidebar-backdrop" onClick={onClose} aria-hidden />}
    <aside className={clsx('sidebar', overlay && 'sidebar--overlay', open && 'sidebar--open', className)} {...props}>
      <div className="sidebar__content">{children}</div>
    </aside>
  </>
);

export default Sidebar;
