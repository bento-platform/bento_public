import { useEffect, useCallback, useMemo, useState, type ReactNode } from 'react';
import { Table, type TablePaginationConfig } from 'antd';
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
  expandedRowRender?: (record: T) => ReactNode;
  pagination?: TablePaginationConfig;
  loading?: boolean;
  defaultI18nPrefix?: string;
  queryKey?: string;
  urlAware?: boolean;
}

const CustomTable = <T extends object>({
  dataSource,
  columns,
  rowKey,
  isRowExpandable,
  expandedRowRender,
  pagination,
  loading,
  defaultI18nPrefix,
  queryKey = EXPANDED_QUERY_PARAM_KEY,
  urlAware = true,
}: CustomTableProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const notify = useNotify();
  const t = useTranslationFn();

  // Local state for expanded keys. If we're in URL-aware mode, this will remain unused.
  const [localExpandedKeys, setLocalExpandedKeys] = useState<string[]>([]);

  const expandedKeys = useMemo(
    () => (urlAware ? deserializeExpandedKeys(searchParams, queryKey) : localExpandedKeys),
    [urlAware, searchParams, queryKey, localExpandedKeys]
  );

  const rowKeyFn: RowKeyFn<WithVisible<T>> = useMemo(() => {
    if (typeof rowKey === 'function') return rowKey;
    return (record: WithVisible<T>) => String(record[rowKey as keyof WithVisible<T>]);
  }, [rowKey]);

  // A bit hacky - we use isVisible as a key to represent "expandability" internally in this component:
  const visibleData = useMemo(() => addVisibilityProperty(dataSource, isRowExpandable), [dataSource, isRowExpandable]);

  // TODO: only use prefix on columns with data index or key but no title set:
  const translatedColumns = useTranslatedTableColumnTitles(columns, defaultI18nPrefix) as CustomTableColumns<
    WithVisible<T>
  >;
  const processedColumns = useMemo(
    () =>
      translatedColumns.map((col) => {
        // If we don't have a dataIndex, this isn't a data column, so we pass undefined to the isEmpty function if it
        // exists (unless alwaysShow is set); otherwise, we always render the non-data column.
        // If it is a data column, evaluate if we have content for at least one row in the column.

        const hasData =
          col.alwaysShow ||
          (col.key && !col.dataIndex
            ? visibleData.some((record) => (col.isEmpty ? !col.isEmpty(undefined, record) : true))
            : visibleData.some((record) =>
                col.isEmpty
                  ? !col.isEmpty(record[col.dataIndex as keyof T], record)
                  : Boolean(record[col.dataIndex as keyof T])
              ));
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
      if (expandedKeysThatExist.length !== expandedKeys.length && urlAware) {
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
      if (urlAware) {
        setSearchParams((prev) => modifySearchParam(prev, queryKey, validExpandedKeys), { replace: true });
      } else {
        setLocalExpandedKeys(validExpandedKeys);
      }
    }
  }, [
    expandedRowRender,
    urlAware,
    validExpandedKeys,
    expandedKeysThatExist,
    expandedKeys,
    notify,
    queryKey,
    t,
    setSearchParams,
  ]);

  const handleExpand = useCallback(
    (expanded: boolean, record: WithVisible<T>) => {
      const key = rowKeyFn(record);
      const nextKeys = expanded ? Array.from(new Set([...expandedKeys, key])) : expandedKeys.filter((k) => k !== key);
      if (urlAware) {
        setSearchParams((prev) => modifySearchParam(prev, queryKey, nextKeys), { replace: true });
      } else {
        setLocalExpandedKeys(nextKeys);
      }
    },
    [expandedKeys, queryKey, urlAware, rowKeyFn, setSearchParams]
  );

  return (
    <Table<WithVisible<T>>
      className="compact"
      columns={processedColumns}
      loading={loading}
      dataSource={visibleData}
      expandable={{
        expandedRowRender,
        // Here, isVisible means "is expandable", we're just using the WithVisible type internally:
        rowExpandable: (record) => record.isVisible,
        showExpandColumn: visibleData.some((r) => r.isVisible),
        expandedRowKeys: expandedKeys,
        onExpand: handleExpand,
      }}
      rowKey={rowKeyFn} // Need to pass rowKeyFn here since we are casting to string in the case of int keys.
      pagination={pagination ?? false}
      bordered={true}
    />
  );
};

export default CustomTable;
