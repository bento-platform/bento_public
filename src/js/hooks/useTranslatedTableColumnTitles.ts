import type { TableColumnsType } from 'antd';

import { useTranslationFn } from '@/hooks';

/**
 * Ant Design table column title translation hook, with optional auto-prefixing.
 * @param columns - array of Ant Design column objects
 * @param i18nPrefix - optional i18n prefix for all string column titles
 */
export const useTranslatedTableColumnTitles = <T>(
  columns: TableColumnsType<T>,
  i18nPrefix?: string
): TableColumnsType<T> => {
  const t = useTranslationFn();

  return columns.map((column) => ({
    ...column,
    title: typeof column.title === 'string' ? t((i18nPrefix ?? '') + column.title) : column.title,
  }));
};
