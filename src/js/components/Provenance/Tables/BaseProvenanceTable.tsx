import React from 'react';
import { Table, TableProps } from 'antd';
import { AnyObject } from 'antd/es/table/Table';

const BaseProvenanceTable = <T extends AnyObject>(props: TableProps<T>) => (
  <Table
    bordered={true}
    pagination={false}
    size="small"
    {...props}
  />
);

export default BaseProvenanceTable;
