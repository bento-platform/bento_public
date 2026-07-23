import { CalendarOutlined, FileDoneOutlined, TagOutlined, UnorderedListOutlined } from '@ant-design/icons';

import { T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import { studyContextTranslationKey } from '@/features/catalogue/hooks';
import type { Dataset } from '@/types/dataset';
import { CopyButton } from './bits';
import StatusBadge from '@Util/StatusBadge';

type ModalHeaderProps = {
  dataset: Dataset;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
};

const ProvenanceHeader = ({ dataset, copiedKey, onCopy }: ModalHeaderProps) => {
  const t = useTranslationFn();
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

      <ul className="pm-meta-strip">
        <li>
          <span className="pm-id-pill">
            {dataset.identifier}
            <CopyButton value={dataset.identifier} id="identifier" copiedKey={copiedKey} onCopy={onCopy} />
          </span>
        </li>
        {dataset.version && (
          <li className="pm-meta-item">
            <TagOutlined />
            <span className="pm-meta-lbl">{t('provenance.version')}</span>
            {dataset.version}
          </li>
        )}
        {dataset.release_date && (
          <li className="pm-meta-item">
            <CalendarOutlined />
            <span className="pm-meta-lbl">{t('provenance.released')}</span>
            {dataset.release_date}
          </li>
        )}
        {dataset.last_modified && (
          <li className="pm-meta-item">
            <CalendarOutlined />
            <span className="pm-meta-lbl">{t('provenance.modified')}</span>
            {dataset.last_modified}
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProvenanceHeader;
