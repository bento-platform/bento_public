import React from 'react';
import { Spinner } from 'react-bootstrap';

function Loader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spinner animation="border" />
    </div>
  );
}

export default Loader;
