import React from 'react';
import type { TableProps } from 'antd';
import { Table } from 'antd';
import type { AnyObject } from 'antd/es/_util/type';

const BaseProvenanceTable = <T extends AnyObject>(props: TableProps<T>) => (
  <Table bordered={true} pagination={false} size="small" {...props} />
);

export default BaseProvenanceTable;
