import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import type { WithVisible } from '@/types/util';
import { Table, type TableProps } from 'antd';

type VisibilityFunc<T> = (record: T) => boolean;

export const addVisibilityProperty = <T,>(r: T[], visibilityFn: VisibilityFunc<T>): WithVisible<T>[] => {
  return r.map((item) => ({
    ...item,
    isVisible: visibilityFn(item),
  }));
};

interface CustomTableProps<T> {
  dataSource: T[];
  columns: TableProps<T>['columns'];
  rowKey: TableProps<WithVisible<T>>['rowKey'];
  isDataKeyVisible: VisibilityFunc<T>;
  expandedRowRender?: (record: T) => React.ReactNode;
}

const CustomTable = <T,>({ dataSource, columns, rowKey, isDataKeyVisible, expandedRowRender }: CustomTableProps<T>) => {
  const updatedColumns = useTranslatedTableColumnTitles<T>(columns || []) as TableProps<WithVisible<T>>['columns'];
  const dataSourceWithVisibility = addVisibilityProperty<T>(dataSource, isDataKeyVisible);

  return (
    <Table<WithVisible<T>>
      columns={updatedColumns}
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
