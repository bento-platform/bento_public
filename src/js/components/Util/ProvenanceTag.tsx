import type { ReactNode } from 'react';
import { Tag } from 'antd';

const ProvenanceTag = ({ children }: { children: ReactNode }) => (
  <Tag className="provenance-tag">{children}</Tag>
);

export default ProvenanceTag;
