import { Flex, theme } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { LuExternalLink } from 'react-icons/lu';
import type { Link } from '@/types/dataset';

const { useToken } = theme;

const LinksDisplay = ({ links }: { links: Link[] }) => {
  const { token } = useToken();
  return (
    <Flex wrap gap={12}>
      {links.map((l, i) => (
        <a
          key={i}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: 8, border: `1px solid #f0f0f0`, borderRadius: 12 }}
        >
          <LinkOutlined style={{ padding: 8, borderRadius: 8, backgroundColor: token.colorPrimaryBg }} /> {l.label}{' '}
          <LuExternalLink />
        </a>
      ))}
    </Flex>
  );
};

export default LinksDisplay;
