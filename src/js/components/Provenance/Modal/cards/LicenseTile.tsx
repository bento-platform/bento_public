import { AuditOutlined, ExportOutlined } from '@ant-design/icons';

import type { License } from '@/types/dataset';

export const LicenseTile = ({ license }: { license: License }) => (
  <a
    className="pm-link-tile"
    href={license.url || undefined}
    target={license.url ? '_blank' : undefined}
    rel="noreferrer"
    style={{ maxWidth: 330, textDecoration: 'none' }}
  >
    <span className="pm-lt-ic" aria-hidden>
      <AuditOutlined />
    </span>
    <span className="pm-lt-main">
      {license.type && <span className="pm-lt-type">{license.type}</span>}
      <span className="pm-lt-label">{license.label}</span>
    </span>
    {license.url && <ExportOutlined className="pm-lt-ext" />}
  </a>
);
