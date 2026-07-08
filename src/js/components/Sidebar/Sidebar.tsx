import type { HTMLAttributes, ReactNode } from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';

/*
 * Structure:
 *   Sidebar
 *     SidebarSection
 *       SidebarFacet
 *       SidebarFacet
 *       ...
 *     SidebarSection
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
  <div className={'sidebar-facet' + (collapsed ? ' sidebar-facet--collapsed' : '')}>
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

export type SidebarProps = HTMLAttributes<HTMLElement> & { width?: string | number };

const Sidebar = ({ children, className, ...props }: SidebarProps) => {
  return (
    <aside className={clsx('sidebar', className)} {...props}>
      <div className="sidebar__content">{children}</div>
    </aside>
  );
};

export default Sidebar;
