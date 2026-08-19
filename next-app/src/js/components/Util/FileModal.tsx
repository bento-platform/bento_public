import type { CSSProperties, ReactNode } from 'react';
import { Modal, type ModalProps } from 'antd';

import { FileDisplay } from 'bento-file-display';

import { useAuthorizationHeader } from 'bento-auth-js';
import { useDrsHttpsAccessOrPassThrough } from '@/features/drs/hooks';

const MODAL_STYLE: CSSProperties = {
  // the flex display allows items which are less wide (e.g., portrait PDFs) to have a narrower modal
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  top: 50, // down from default of 100; gives a bit more screen real estate
};
const MODAL_INNER_STYLES: ModalProps['styles'] = {
  body: {
    minWidth: '692px',
    maxWidth: '90vw', // needed, otherwise this ends up being more than the parent width for some reason
  },
};

type FileModalProps = {
  title: ReactNode;
  open: boolean;
  onCancel: ModalProps['onCancel'];
  hasTriggered?: boolean;
  url?: string;
  fileName?: string;
  loading?: boolean;
};

// Ported from Bento Web
const FileModal = ({ title, open, onCancel, hasTriggered, url, fileName, loading }: FileModalProps) => {
  const authHeader = useAuthorizationHeader();
  const finalUrl = useDrsHttpsAccessOrPassThrough(url);
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      width="90vw"
      style={MODAL_STYLE}
      styles={MODAL_INNER_STYLES}
      footer={null}
      // destroyOnHidden in order to stop audio/video from playing & avoid memory leaks at the cost of re-fetching:
      destroyOnHidden={true}
    >
      {(hasTriggered ?? true) && (
        <FileDisplay
          uri={finalUrl ?? undefined}
          fileName={fileName}
          loading={loading ?? false}
          authHeader={authHeader}
        />
      )}
    </Modal>
  );
};

export default FileModal;
