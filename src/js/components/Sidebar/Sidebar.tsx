import type { HTMLAttributes, ReactNode } from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';

export const SidebarSection = ({ title, collapsed, children }: { title: string; collapsed?: boolean; children: ReactNode }) => (
  <div className={"sidebar-section" + (collapsed ? ' sidebar-section--collapsed' : '')}>

  </div>
);

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  title: ReactNode;
  statusText?: ReactNode;
};

const Sidebar = ({ title, children, statusText, className, ...props }: SidebarProps) => {
  return (
    <aside className={clsx('sidebar', className)} {...props}>
      <header className="sidebar__header">
        <Typography.Title level={3} className="sidebar__title">
          {title}
        </Typography.Title>
        {statusText && <span className="sidebar__status">{statusText}</span>}
      </header>
      <div className="sidebar__content">{children}</div>
    </aside>
  );
};

export default Sidebar;
