import React from 'react';
import { useSelector } from 'react-redux';

const SearchResults = () => {
  const { status, count, message } = useSelector(
    (state) => state.query.queryResponseData
  );

  const wrapperStyle = {
    padding: '40px',
    minHeight: '150px',
    maxHeight: '150px',
  };
  const textStyle = { fontSize: '30px' };

  if (status === 'initial') return null;
  else
    return (
      <div style={wrapperStyle}>
        <p style={textStyle}>
          {status === 'count' ? `count: ${count}` : message}
        </p>
      </div>
    );
};

export default SearchResults;
