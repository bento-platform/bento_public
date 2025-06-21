import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import type { WithVisible } from '@/types/util';
import { Table, type TableColumnType, type TableProps } from 'antd';

export interface CustomTableColumn<T> extends TableColumnType<T> {
  isEmpty?: (value: any, record?: T) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
  isEmptyDefaultCheck?: boolean;
}

export type CustomTableColumns<T> = CustomTableColumn<T>[];

type VisibilityFunc<T> = (record: T) => boolean;

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
  const updatedColumns = useTranslatedTableColumnTitles<T>(columns || []) as CustomTableColumns<WithVisible<T>>;
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

  return (
    <Table<WithVisible<T>>
      columns={updatedColumnsWithVisibility}
      dataSource={dataSourceWithVisibility}
      expandable={{
        expandedRowRender,
        rowExpandable: (record) => record.isVisible,
        showExpandColumn: dataSourceWithVisibility.some((record) => record.isVisible),
      }}
      rowKey={rowKey}
      pagination={false}
      bordered
    />
  );
};

export default CustomTable;
