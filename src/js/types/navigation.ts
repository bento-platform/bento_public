import type { MenuProps } from 'antd';

// Re-export of the awkward typing for Antd menu items
export type MenuItem = Required<MenuProps>['items'][number];

/** Where a user was when they navigated into a dataset's scope from one of its cards (see ScopeHeader's back button). */
export type BackOrigin = 'catalogue' | 'project';

/** Shape of the react-router history state used by dataset-scope navigation. */
export type ScopeLocationState = { backOrigin?: BackOrigin } | null;
