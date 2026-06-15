import { Tag, theme } from 'antd';

const ProvenanceTag = ({ children }: { children: React.ReactNode }) => {
  const { token } = theme.useToken();
  return (
    <Tag
      style={{
        fontSize: 11,
        borderRadius: 4,
        margin: 0,
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
