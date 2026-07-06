import {
  AuditOutlined,
  DownloadOutlined,
  ExportOutlined,
  FileDoneOutlined,
  LinkOutlined,
  NumberOutlined,
} from '@ant-design/icons';

import type { Link, TypedLink } from '@/types/dataset';

const LINK_TYPE_ICONS: Record<string, React.ReactNode> = {
  'Downloadable Artifact': <DownloadOutlined />,
  'Data Management Plan': <FileDoneOutlined />,
  Schema: <NumberOutlined />,
  'External Reference': <ExportOutlined />,
  'Data Access': <AuditOutlined />,
  'Data Request Form': <FileDoneOutlined />,
};

export const LinkTile = ({ link }: { link: Link }) => {
  const typed = link as Partial<TypedLink>;
  const typeStr =
    typeof typed.type === 'string' ? typed.type : typeof typed.type === 'object' ? typed.type?.other : undefined;
  const icon = (typeStr && LINK_TYPE_ICONS[typeStr]) ?? <LinkOutlined />;
  return (
    <a className="pm-link-tile" href={link.url} target="_blank" rel="noreferrer">
      <span className="pm-lt-ic">{icon}</span>
      <span className="pm-lt-main">
        {typeStr && <span className="pm-lt-type">{typeStr}</span>}
        <span className="pm-lt-label">{link.label}</span>
      </span>
      <ExportOutlined className="pm-lt-ext" />
    </a>
  );
};
