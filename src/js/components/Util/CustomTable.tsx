import { useEffect, useCallback, useMemo } from 'react';
import { Table } from 'antd';
import type { TableColumnType } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { useNotify } from '@/hooks/notifications';
import { useTranslationFn } from '@/hooks';

import type { WithVisible } from '@/types/util';
import { EXPANDED_QUERY_PARAM_KEY } from '@/constants/table';

export interface CustomTableColumn<T> extends TableColumnType<T> {
  isEmpty?: (value: any, record?: T) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
  isEmptyDefaultCheck?: boolean;
}

export type CustomTableColumns<T> = CustomTableColumn<T>[];

type VisibilityFn<T> = (record: T) => boolean;
type RowKeyFn<T> = (record: T, index?: number) => string;

function addVisibility<T>(items: T[], isVisible: VisibilityFn<T>): WithVisible<T>[] {
  return items.map((item) => ({ ...item, isVisible: isVisible(item) }));
}

function serializeExpandedKeys(keys: string[]) {
  const params = new URLSearchParams();
  if (keys.length) params.set(EXPANDED_QUERY_PARAM_KEY, keys.join(','));
  return params;
}

function deserializeExpandedKeys(params: URLSearchParams): string[] {
  const raw = params.get(EXPANDED_QUERY_PARAM_KEY);
  return raw ? raw.split(',').filter(Boolean) : [];
}

interface CustomTableProps<T> {
  dataSource: T[];
  columns: CustomTableColumns<T>;
  rowKey: string | RowKeyFn<WithVisible<T>>;
  isDataKeyVisible: VisibilityFn<T>;
  expandedRowRender?: (record: T) => React.ReactNode;
}

const CustomTable = <T extends object>({
  dataSource,
  columns,
  rowKey,
  isDataKeyVisible,
  expandedRowRender,
}: CustomTableProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const notify = useNotify();
  const t = useTranslationFn();

  const expandedKeys = useMemo(() => deserializeExpandedKeys(searchParams), [searchParams]);

  const rowKeyFn: RowKeyFn<WithVisible<T>> = useMemo(() => {
    if (typeof rowKey === 'function') return rowKey;
    return (record: WithVisible<T>) => String(record[rowKey as keyof WithVisible<T>]);
  }, [rowKey]);

  const visibleData = useMemo(() => addVisibility(dataSource, isDataKeyVisible), [dataSource, isDataKeyVisible]);

  const translatedColumns = useTranslatedTableColumnTitles(columns) as CustomTableColumns<WithVisible<T>>;
  const processedColumns = useMemo(() => {
    return translatedColumns.map((col) => {
      const hasData = visibleData.some((record) =>
        col.isEmpty
          ? !col.isEmpty(record[col.dataIndex as keyof T], record)
          : col.isEmptyDefaultCheck
            ? Boolean(record[col.dataIndex as keyof T])
            : true
      );
      return { ...col, hidden: !hasData };
    });
  }, [translatedColumns, visibleData]);

  const validExpandedKeys = useMemo(() => {
    const keySet = new Set(visibleData.filter((r) => r.isVisible).map(rowKeyFn));
    return expandedKeys.filter((k) => keySet.has(k));
  }, [visibleData, expandedKeys, rowKeyFn]);

  useEffect(() => {
    if (validExpandedKeys.length !== expandedKeys.length) {
      notify.warning({
        message: t('table.invalid_row_keys_title'),
        description: t('table.invalid_row_keys_description'),
      });
      setSearchParams(serializeExpandedKeys(validExpandedKeys), { replace: true });
    }
  }, [validExpandedKeys, expandedKeys, notify, t, setSearchParams]);

  const handleExpand = useCallback(
    (expanded: boolean, record: WithVisible<T>) => {
      const key = rowKeyFn(record);
      const nextKeys = expanded ? Array.from(new Set([...expandedKeys, key])) : expandedKeys.filter((k) => k !== key);
      setSearchParams(serializeExpandedKeys(nextKeys), { replace: true });
    },
    [expandedKeys, rowKeyFn, setSearchParams]
  );

  return (
    <Table<WithVisible<T>>
      columns={processedColumns}
      dataSource={visibleData}
      expandable={{
        expandedRowRender,
        rowExpandable: (record) => record.isVisible,
        showExpandColumn: visibleData.some((r) => r.isVisible),
        expandedRowKeys: expandedKeys,
        onExpand: handleExpand,
      }}
      rowKey={rowKey}
      pagination={false}
      bordered
    />
  );
};

export default CustomTable;
