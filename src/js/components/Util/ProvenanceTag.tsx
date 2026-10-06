import type { ReactNode } from 'react';
import { PCGL_MODE } from '@/config';
import { Tag } from 'antd';

const ProvenanceTag = ({ children }: { children: ReactNode }) => (
  <Tag color={PCGL_MODE ? '#054A74' : '#0958D9'} variant="outlined">
    {children}
  </Tag>
);

export default ProvenanceTag;
