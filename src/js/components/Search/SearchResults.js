import React from 'react';
import { useSelector } from 'react-redux';

const SearchResults = ({ queryResponseData, isFetchingData }) => {
  const { status, count, message } = useSelector(
    (state) => state.query.queryResponseData
  );

  const wrapperStyle = {
    padding: '40px',
    minHeight: '150px',
    maxHeight: '150px',
  };
  const textStyle = { fontSize: '30px' };

  // TODO: return styled reponse instead of just text

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
