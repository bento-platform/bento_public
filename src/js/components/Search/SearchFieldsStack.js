import React from 'react';
import MakeQueryOption from './MakeQueryOption';

const SearchFieldsStack = ({ queryFields }) => {
  return (
    <>
      {queryFields.map((e, i) => (
        <MakeQueryOption key={i} queryField={e} />
      ))}
    </>
  );
};

export default SearchFieldsStack;
