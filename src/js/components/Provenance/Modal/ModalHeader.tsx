import {
  CalendarOutlined,
  CloseOutlined,
  FileDoneOutlined,
  TagOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import { statusTranslationKey } from '@/features/catalogue/hooks';
import type { Dataset } from '@/types/dataset';
import { CopyButton } from './cards';

type ModalHeaderProps = {
  dataset: Dataset;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
  onClose: () => void;
};

const ModalHeader = ({ dataset, copiedKey, onCopy, onClose }: ModalHeaderProps) => {
  const t = useTranslationFn();
  return (
    <div className="pm-head">
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
            {dataset.study_status && (
              <span className={`pm-status pm-status-${dataset.study_status.toLowerCase()}`}>
                <span className="pm-dot" />
                {t(statusTranslationKey(dataset.study_status))}
              </span>
            )}
            {dataset.study_context && (
              <span className="pm-ctx-chip">{dataset.study_context === 'CLINICAL' ? 'Clinical' : 'Research'}</span>
            )}
          </div>
        </div>
        <div className="pm-head-tools">
          <button type="button" className="pm-icon-btn bare" title="Close" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>
      </div>

      <ul className="pm-meta-strip">
        <span className="pm-id-pill">
          {dataset.identifier}
          <CopyButton value={dataset.identifier} id="identifier" copiedKey={copiedKey} onCopy={onCopy} />
        </span>
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

export default ModalHeader;
