import React from 'react';
import MakeQueryOption from './MakeQueryOption';
import { Space } from 'antd';

const SearchFieldsStack = ({ queryFields, queryKatsuPublicFunc }) => {
  return (
    <Space direction="vertical" size="small">
      {queryFields.map((e, i) => (
        <MakeQueryOption key={i} queryField={e} queryKatsuPublicFunc={queryKatsuPublicFunc} />
      ))}
    </Space>
  );
};

export default SearchFieldsStack;
