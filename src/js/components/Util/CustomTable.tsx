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
  alwaysShow?: boolean;
}

export type CustomTableColumns<T> = CustomTableColumn<T>[];

type VisibilityFn<T> = (record: T) => boolean;
type RowKeyFn<T> = (record: T, index?: number) => string;

function addVisibility<T>(items: T[], isVisible: VisibilityFn<T>): WithVisible<T>[] {
  return items.map((item) => ({ ...item, isVisible: isVisible(item) }));
}

function serializeExpandedKeys(keys: string[]): string {
  return keys.join(',');
}

function deserializeExpandedKeys(params: URLSearchParams, queryKey: string): string[] {
  const raw = params.get(queryKey);
  return raw ? raw.split(',').filter(Boolean) : [];
}

function modifySearchParam(oldParams: URLSearchParams, queryKey: string, value: string[]): URLSearchParams {
  const out = new URLSearchParams(oldParams);
  value.length ? out.set(queryKey, serializeExpandedKeys(value)) : out.delete(queryKey);
  return out;
}

interface CustomTableProps<T> {
  dataSource: T[];
  columns: CustomTableColumns<T>;
  rowKey: string | RowKeyFn<WithVisible<T>>;
  isDataKeyVisible: VisibilityFn<T>;
  expandedRowRender?: (record: T) => React.ReactNode;
  queryKey?: string;
}

const CustomTable = <T extends object>({
  dataSource,
  columns,
  rowKey,
  isDataKeyVisible,
  expandedRowRender,
  queryKey = EXPANDED_QUERY_PARAM_KEY,
}: CustomTableProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const notify = useNotify();
  const t = useTranslationFn();

  const expandedKeys = useMemo(() => deserializeExpandedKeys(searchParams, queryKey), [searchParams, queryKey]);

  const rowKeyFn: RowKeyFn<WithVisible<T>> = useMemo(() => {
    if (typeof rowKey === 'function') return rowKey;
    return (record: WithVisible<T>) => String(record[rowKey as keyof WithVisible<T>]);
  }, [rowKey]);

  const visibleData = useMemo(() => addVisibility(dataSource, isDataKeyVisible), [dataSource, isDataKeyVisible]);

  const translatedColumns = useTranslatedTableColumnTitles(columns) as CustomTableColumns<WithVisible<T>>;
  const processedColumns = useMemo(
    () =>
      translatedColumns.map((col) => {
        const hasData = visibleData.some((record) =>
          col.alwaysShow
            ? true
            : col.isEmpty
              ? !col.isEmpty(record[col.dataIndex as keyof T], record)
              : Boolean(record[col.dataIndex as keyof T])
        );
        return { ...col, hidden: !hasData };
      }),
    [translatedColumns, visibleData]
  );

  const validExpandedKeys = useMemo(() => {
    const keySet = new Set(visibleData.filter((r) => r.isVisible).map(rowKeyFn));
    return expandedKeys.filter((k) => keySet.has(k));
  }, [visibleData, expandedKeys, rowKeyFn]);

  useEffect(() => {
    if (expandedRowRender && validExpandedKeys.length !== expandedKeys.length) {
      notify.warning({
        message: t('table.invalid_row_keys_title'),
        description: t('table.invalid_row_keys_description'),
      });
      setSearchParams((prev) => modifySearchParam(prev, queryKey, validExpandedKeys), { replace: true });
    }
  }, [expandedRowRender, validExpandedKeys, expandedKeys, notify, queryKey, t, setSearchParams]);

  const handleExpand = useCallback(
    (expanded: boolean, record: WithVisible<T>) => {
      const key = rowKeyFn(record);
      const nextKeys = expanded ? Array.from(new Set([...expandedKeys, key])) : expandedKeys.filter((k) => k !== key);
      setSearchParams((prev) => modifySearchParam(prev, queryKey, nextKeys), { replace: true });
    },
    [expandedKeys, queryKey, rowKeyFn, setSearchParams]
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
      bordered={true}
      size="small"
    />
  );
};

export default CustomTable;
