import type { ReactNode } from 'react';
import type { MenuProps } from 'antd';

// Re-export of the awkward typing for Antd menu items
export type MenuItem = Required<MenuProps>['items'][number];

/** A plain navigation entry: always has a string key and a string label (no dividers, groups or custom nodes). */
export type SiteMenuItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  children?: SiteMenuItem[];
};

/** Where a user was when they navigated into a dataset's scope from one of its cards (see ScopeHeader's back button). */
export type BackOrigin = 'catalogue' | 'project';
