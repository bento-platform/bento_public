import { useMemo, type ReactNode } from 'react';

import { CalendarOutlined, FileDoneOutlined, TagOutlined, UnorderedListOutlined } from '@ant-design/icons';

import { T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import { studyContextTranslationKey } from '@/features/catalogue/utils';
import type { Dataset } from '@/types/dataset';
import StatusBadge from '@Util/StatusBadge';

type ProvenanceHeaderProps = { dataset: Dataset };

type MetaItem = { icon: ReactNode; label: string; value: string };

const ProvenanceHeader = ({ dataset }: ProvenanceHeaderProps) => {
  const t = useTranslationFn();

  const metaItems = useMemo<MetaItem[]>(() => {
    const items: MetaItem[] = [];

    if (dataset.version) {
      items.push({ icon: <TagOutlined />, label: t('provenance.version'), value: dataset.version });
    }
    if (dataset.release_date) {
      items.push({ icon: <CalendarOutlined />, label: t('provenance.released'), value: dataset.release_date });
    }
    if (dataset.last_modified) {
      items.push({ icon: <CalendarOutlined />, label: t('provenance.modified'), value: dataset.last_modified });
    }

    return items;
  }, [dataset, t]);

  return (
    <div className="pm-head distinguished">
      <div className="pm-head-top">
        <div className="pm-head-mark">
          <FileDoneOutlined />
        </div>
        <div className="pm-head-main">
          <div className="pm-eyebrow">
            <UnorderedListOutlined style={{ fontSize: 12 }} />
            {t('entities.dataset', T_SINGULAR_COUNT)}
            {dataset.program_name ? ` · ${dataset.program_name}` : ''}
          </div>
          <div className="pm-title-row">
            <h1>{t(dataset.title)}</h1>
            {dataset.study_status && <StatusBadge status={dataset.study_status} />}
            {dataset.study_context && (
              <span className="pm-ctx-chip">{t(studyContextTranslationKey(dataset.study_context))}</span>
            )}
          </div>
        </div>
      </div>

      {!!metaItems.length && (
        <ul className="pm-meta-strip">
          {metaItems.map(({ icon, label, value }, idx) => (
            <li className="pm-meta-item" key={idx}>
              {icon}
              <span className="pm-meta-lbl">{label}</span>
              {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProvenanceHeader;
