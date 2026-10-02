import type { ReactNode } from 'react';
import { Tag } from 'antd';

const ProvenanceTag = ({ children }: { children: ReactNode }) => (
  <Tag color="geekblue" variant="outlined">
    {children}
  </Tag>
);

export default ProvenanceTag;
