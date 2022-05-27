import React from 'react';
import { useSelector } from 'react-redux';
import QueryParameter from './QueryParameter';

const SearchFieldsStack = () => {
  const params = useSelector((state) => state.query.queryableFields);

  return (
    <>
      {params.map((e, i) => (
        <QueryParameter key={i} Item={e} />
      ))}
    </>
  );
};

export default SearchFieldsStack;
