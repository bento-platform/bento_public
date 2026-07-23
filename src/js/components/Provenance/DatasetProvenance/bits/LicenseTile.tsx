import { AuditOutlined, ExportOutlined } from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import type { License } from '@/types/dataset';

export const LicenseTile = ({ license }: { license: License }) => {
  const t = useTranslationFn();
  return (
    <a
      className="pm-link-tile"
      href={license.url || undefined}
      target={license.url ? '_blank' : undefined}
      rel="noreferrer"
      style={{ maxWidth: 330, textDecoration: 'none' }}
    >
      <span className="pm-link-tile-ic" aria-hidden>
        <AuditOutlined />
      </span>
      <span className="pm-link-tile-main" aria-label={t('provenance.license')}>
        {license.type && <span className="pm-link-tile-type">{license.type}</span>}
        <span className="pm-link-tile-label">{license.label}</span>
      </span>
      {license.url && <ExportOutlined className="pm-link-tile-ext" />}
    </a>
  );
};
