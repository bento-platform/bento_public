import CustomTable, { type CustomTableProps } from '@Util/CustomTable';

const BaseProvenanceTable = <T extends object>(props: Omit<CustomTableProps<T>, 'isRowExpandable' | 'pagination'>) => (
  <CustomTable isRowExpandable={() => false} {...props} />
);

export default BaseProvenanceTable;
