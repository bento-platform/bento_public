import type { ReactNode } from 'react';
import { Tag, theme } from 'antd';

const ProvenanceTag = ({ children }: { children: ReactNode }) => {
  const { token } = theme.useToken();
  return (
    <Tag
      className="provenance-tag"
      style={{
        background: token.colorPrimaryBg,
        color: token.colorPrimary,
        border: `1px solid ${token.colorPrimaryBorder}`,
      }}
    >
      {children}
    </Tag>
  );
};

export default ProvenanceTag;
