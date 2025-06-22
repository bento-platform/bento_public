import { useEffect, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import type { WithVisible } from '@/types/util';
import { Table, type TableColumnType, type TableProps } from 'antd';
import { EXPANDED_QUERY_PARAM_KEY } from '@/constants/table';
import { useNotify } from '@/hooks/NotificationContext';
import { useTranslationFn } from '@/hooks';

export interface CustomTableColumn<T> extends TableColumnType<T> {
  isEmpty?: (value: any, record?: T) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
  isEmptyDefaultCheck?: boolean;
}

export type CustomTableColumns<T> = CustomTableColumn<T>[];

type VisibilityFunc<T> = (record: T) => boolean;
type RowSelectorFunc<T> = (record: T) => string;

export const addVisibilityProperty = <T,>(r: T[], visibilityFn: VisibilityFunc<T>): WithVisible<T>[] => {
  return r.map((item) => ({
    ...item,
    isVisible: visibilityFn(item),
  }));
};

interface CustomTableProps<T> {
  dataSource: T[];
  columns: CustomTableColumns<T>;
  rowKey: TableProps<WithVisible<T>>['rowKey'];
  isDataKeyVisible: VisibilityFunc<T>;
  expandedRowRender?: (record: T) => React.ReactNode;
}

const CustomTable = <T,>({ dataSource, columns, rowKey, isDataKeyVisible, expandedRowRender }: CustomTableProps<T>) => {
  type VT = WithVisible<T>;

  const [searchParams, setSearchParams] = useSearchParams();
  const urlExpanded = searchParams.get(EXPANDED_QUERY_PARAM_KEY)?.split(',').filter(Boolean) || [];
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const api = useNotify();
  const t = useTranslationFn();

  const getKey = useMemo<RowSelectorFunc<VT>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey as RowSelectorFunc<VT>;
    }
    return (record: VT) => String(record[rowKey as keyof VT]);
  }, [rowKey]);

  const updatedColumns = useTranslatedTableColumnTitles<T>(columns || []) as CustomTableColumns<VT>;
  const dataSourceWithVisibility = addVisibilityProperty<T>(dataSource, isDataKeyVisible);
  const updatedColumnsWithVisibility = updatedColumns!.map((col) => {
    if (col.isEmpty) {
      return {
        ...col,
        hidden: !dataSourceWithVisibility.some((record) => !col.isEmpty!(record[col.dataIndex as keyof T], record)),
      };
    } else if (col.isEmptyDefaultCheck) {
      return {
        ...col,
        hidden: !dataSourceWithVisibility.some((record) => record[col.dataIndex as keyof T]),
      };
    }
    return col;
  });

  const validKeys = useMemo(() => {
    const keysSet = new Set(dataSourceWithVisibility.map(getKey));
    return urlExpanded.filter((key) => keysSet.has(key));
  }, [dataSourceWithVisibility, getKey, urlExpanded]);

  useEffect(() => {
    setExpandedRowKeys(validKeys);
    if (validKeys.length !== urlExpanded.length) {
      api.warning({
        message: t('table.invalid_row_keys_title'),
        description: t('table.invalid_row_keys_description'),
      });

      if (validKeys.length) {
        searchParams.set(EXPANDED_QUERY_PARAM_KEY, validKeys.join(','));
      } else {
        searchParams.delete(EXPANDED_QUERY_PARAM_KEY);
      }
      setSearchParams(searchParams, { replace: true });
    }
  }, [validKeys, urlExpanded, searchParams, setSearchParams, api, t]);

  const onExpand = useCallback(
    (expanded: boolean, record: VT) => {
      const key = getKey(record);
      const next = expanded ? Array.from(new Set([...expandedRowKeys, key])) : expandedRowKeys.filter((k) => k !== key);

      setExpandedRowKeys(next);

      if (next.length) {
        searchParams.set(EXPANDED_QUERY_PARAM_KEY, next.join(','));
      } else {
        searchParams.delete(EXPANDED_QUERY_PARAM_KEY);
      }
      setSearchParams(searchParams, { replace: true });
    },
    [expandedRowKeys, getKey, searchParams, setSearchParams]
  );

  return (
    <Table<VT>
      columns={updatedColumnsWithVisibility}
      dataSource={dataSourceWithVisibility}
      expandable={{
        expandedRowRender,
        rowExpandable: (record) => record.isVisible,
        showExpandColumn: dataSourceWithVisibility.some((record) => record.isVisible),
        expandedRowKeys,
        onExpand: onExpand,
      }}
      rowKey={rowKey}
      pagination={false}
      bordered
    />
  );
};

export default CustomTable;
