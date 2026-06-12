import { Flex } from 'antd';
import { LuExternalLink } from 'react-icons/lu';
import type { Link } from '@/types/dataset';

const LinksDisplay = ({ links }: { links: Link[] }) => (
  <Flex wrap gap={12}>
    {links.map((l, i) => (
      <a key={i} href={l.url} target="_blank" rel="noopener noreferrer">
        {l.label} <LuExternalLink />
      </a>
    ))}
  </Flex>
);

export default LinksDisplay;
