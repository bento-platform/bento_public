import type { ReactNode } from 'react';
import { Tag } from 'antd';
import clsx from 'clsx';

const ProvenanceTag = ({ children, className }: { children: ReactNode; className?: string }) => (
  <Tag className={clsx('provenance-tag', className)}>{children}</Tag>
);

export default ProvenanceTag;
