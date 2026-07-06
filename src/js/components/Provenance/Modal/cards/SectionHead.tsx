import { DownOutlined } from '@ant-design/icons';

export const SectionHead = ({
  title,
  count,
  collapsed,
  onToggle,
}: {
  title: string;
  count?: number;
  collapsed: boolean;
  onToggle: () => void;
}) => (
  <button type="button" className="pm-sec-head" onClick={onToggle}>
    <DownOutlined className="pm-sec-chevron" style={collapsed ? { transform: 'rotate(-90deg)' } : undefined} />
    <h2>{title}</h2>
    {count !== undefined && <span className="pm-sec-cnt">{count}</span>}
  </button>
);
