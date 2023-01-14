import React from 'react';
import MakeQueryOption from './MakeQueryOption';
import { Space } from 'antd';

const SearchFieldsStack = ({ queryFields }) => {
  return (
    <Space direction="vertical" size="small">
      {queryFields.map((e, i) => (
        <MakeQueryOption key={i} queryField={e} />
      ))}
    </Space>
  );
};

export default SearchFieldsStack;
