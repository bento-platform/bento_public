import React from 'react';
import MakeQueryOption from './MakeQueryOption';
import { Space } from 'antd';
import { Field } from '@/types/search';

const SearchFieldsStack = ({ queryFields }: SearchFieldStackProps) => {
  return (
    <Space direction="vertical" size="small">
      {queryFields.map((e, i) => (
        <MakeQueryOption key={i} queryField={e} />
      ))}
    </Space>
  );
};

export interface SearchFieldStackProps {
  queryFields: Field[];
}

export default SearchFieldsStack;
