import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import QueryParameter from './QueryParameter';
import MakeQueryOption from './MakeQueryOption';

const SearchFieldsStack = () => {
  const params = useSelector((state) => state.query.queryableFields);

  return (
    <>
      {params.map((e, i) => (
        <MakeQueryOption key={i} queryField={e} />
      ))}
    </>
  );
};

export default SearchFieldsStack;
