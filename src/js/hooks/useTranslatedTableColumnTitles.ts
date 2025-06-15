import type { TableColumnsType } from 'antd';

import { useTranslationFn } from '@/hooks';

export const useTranslatedTableColumnTitles = <T>(columns: TableColumnsType<T>): TableColumnsType<T> => {
  const t = useTranslationFn();

  return columns.map((column) => ({
    ...column,
    title: typeof column.title === 'string' ? t(column.title) : column.title,
  }));
};
