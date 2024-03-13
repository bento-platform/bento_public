import React from 'react';

import { Skeleton } from 'antd';

const SitePageLoading = () => {
  return (
    <>
      <div style={{ padding: '24px', background: 'white' }}>
        <Skeleton title={false} active={true} />
      </div>
    </>
  );
};

export default SitePageLoading;
