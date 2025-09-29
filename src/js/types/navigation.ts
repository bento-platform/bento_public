import type { MenuProps } from 'antd';

// Re-export of the awkward typing for Antd menu items
export type MenuItem = Required<MenuProps>['items'][number];
