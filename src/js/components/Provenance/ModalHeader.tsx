import {
  AuditOutlined,
  CalendarOutlined,
  CloseOutlined,
  FileDoneOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  TagOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';
import { CopyButton } from './cards';

type ModalHeaderProps = {
  dataset: Dataset;
  fullscreen: boolean;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
  onClose: () => void;
  onToggleFullscreen: () => void;
};

const ModalHeader = ({ dataset, fullscreen, copiedKey, onCopy, onClose, onToggleFullscreen }: ModalHeaderProps) => {
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
            Dataset Provenance{dataset.program_name ? ` · ${dataset.program_name}` : ''}
          </div>
          <div className="pm-title-row">
            <h1>{t(dataset.title)}</h1>
            {dataset.study_status && (
              <span className={`pm-status pm-status-${dataset.study_status.toLowerCase()}`}>
                <span className="pm-dot" />
                {dataset.study_status === 'ONGOING' ? 'Ongoing' : 'Completed'}
              </span>
            )}
            {dataset.study_context && (
              <span className="pm-ctx-chip">
                {dataset.study_context === 'CLINICAL' ? 'Clinical' : 'Research'}
              </span>
            )}
          </div>
        </div>
        <div className="pm-head-tools">
          <button
            type="button"
            className="pm-icon-btn"
            title={fullscreen ? 'Exit full screen' : 'Full screen'}
            onClick={onToggleFullscreen}
          >
            {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          </button>
          <button type="button" className="pm-icon-btn bare" title="Close" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>
      </div>

      <div className="pm-meta-strip">
        <span className="pm-id-pill">
          {dataset.identifier}
          <CopyButton value={dataset.identifier} id="identifier" copiedKey={copiedKey} onCopy={onCopy} />
        </span>
        {dataset.version && (
          <span className="pm-meta-item">
            <TagOutlined />
            <span className="pm-meta-lbl">Version</span>
            {dataset.version}
          </span>
        )}
        {dataset.release_date && (
          <span className="pm-meta-item">
            <CalendarOutlined />
            <span className="pm-meta-lbl">Released</span>
            {dataset.release_date}
          </span>
        )}
        {dataset.last_modified && (
          <span className="pm-meta-item">
            <CalendarOutlined />
            <span className="pm-meta-lbl">Modified</span>
            {dataset.last_modified}
          </span>
        )}
        {dataset.privacy && (
          <span className="pm-meta-item">
            <AuditOutlined />
            <span className="pm-meta-lbl">Privacy</span>
            {dataset.privacy}
          </span>
        )}
      </div>
    </div>
  );
};

export default ModalHeader;
