import { useEffect, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import type { WithVisible } from '@/types/util';
import { Table, type TableColumnType, type TableProps } from 'antd';

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
  const urlExpanded = searchParams.get('expanded')?.split(',').filter(Boolean) || [];
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>(urlExpanded);

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

  useEffect(() => {
    const param = searchParams.get('expanded') || '';
    const keys = param.split(',').filter(Boolean);
    setExpandedRowKeys(keys);
  }, [searchParams]);

  const onExpand = useCallback(
    (expanded: boolean, record: VT) => {
      const key = getKey(record);
      const next = expanded ? Array.from(new Set([...expandedRowKeys, key])) : expandedRowKeys.filter((k) => k !== key);

      setExpandedRowKeys(next);

      if (next.length) {
        searchParams.set('expanded', next.join(','));
      } else {
        searchParams.delete('expanded');
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
