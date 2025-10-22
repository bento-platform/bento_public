import { useEffect, useCallback, useMemo } from 'react';
import { Table } from 'antd';
import type { TableColumnType } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { useNotify } from '@/hooks/notifications';
import { useTranslationFn } from '@/hooks';

import type { VisibilityFn, WithVisible } from '@/types/util';
import { EXPANDED_QUERY_PARAM_KEY } from '@/constants/table';
import { addVisibilityProperty } from '@/utils/tables';

export interface CustomTableColumn<T> extends TableColumnType<T> {
  isEmpty?: (value: any, record?: T) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
  alwaysShow?: boolean;
}

export type CustomTableColumns<T> = CustomTableColumn<T>[];

type RowKeyFn<T> = (record: T, index?: number) => string;

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
  isRowExpandable: VisibilityFn<T>;
  expandedRowRender?: (record: T) => React.ReactNode;
  queryKey?: string;
}

const CustomTable = <T extends object>({
  dataSource,
  columns,
  rowKey,
  isRowExpandable,
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

  // A bit hacky - we use isVisible as a key to represent "expandability" internally in this component:
  const visibleData = useMemo(() => addVisibilityProperty(dataSource, isRowExpandable), [dataSource, isRowExpandable]);

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

  // We can show a warning if we are trying to expand a key that doesn't exist. However, this may not be desirable if
  // we're on first-load and just trying to expand a row clicked on from search, since this is still a valid key (i.e.,
  // exists in the phenopacket, just doesn't have any additional information to expand.)
  // To do this, we build two arrays:
  //  - one with expanded keys that exist in the current data source
  //  - one with expanded keys both exist in the current data source AND are expandable
  // If the second one doesn't match the total list of expanded keys, we need to redirect.
  // If the first one doesn't match, we can show the warning.

  const expandedKeysThatExist = useMemo(() => {
    const keySet = new Set(visibleData.map(rowKeyFn));
    return expandedKeys.filter((k) => keySet.has(k));
  }, [visibleData, expandedKeys, rowKeyFn]);

  const validExpandedKeys = useMemo(() => {
    const keySet = new Set(visibleData.filter((r) => r.isVisible).map(rowKeyFn));
    return expandedKeys.filter((k) => keySet.has(k));
  }, [visibleData, expandedKeys, rowKeyFn]);

  useEffect(() => {
    if (expandedRowRender && validExpandedKeys.length !== expandedKeys.length) {
      // Only warn if we are trying to expand a key that doesn't exist *at all* in the data source, NOT if we're just
      // trying to expand a key that isn't expandable.
      if (expandedKeysThatExist.length !== expandedKeys.length) {
        console.warn(
          t('table.invalid_row_keys_title'),
          'expanded keys:',
          expandedKeys,
          ', expanded keys that exist:',
          expandedKeysThatExist,
          'expanded keys that are valid:',
          validExpandedKeys
        );
        notify.warning({
          message: t('table.invalid_row_keys_title'),
          description: t('table.invalid_row_keys_description'),
        });
      }
      setSearchParams((prev) => modifySearchParam(prev, queryKey, validExpandedKeys), { replace: true });
    }
  }, [expandedRowRender, validExpandedKeys, expandedKeysThatExist, expandedKeys, notify, queryKey, t, setSearchParams]);

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
      className="compact"
      columns={processedColumns}
      dataSource={visibleData}
      expandable={{
        expandedRowRender,
        // Here, isVisible means "is expandable", we're just using the WithVisible type internally:
        rowExpandable: (record) => record.isVisible,
        showExpandColumn: visibleData.some((r) => r.isVisible),
        expandedRowKeys: expandedKeys,
        onExpand: handleExpand,
      }}
      rowKey={rowKey}
      pagination={false}
      bordered={true}
    />
  );
};

export default CustomTable;
