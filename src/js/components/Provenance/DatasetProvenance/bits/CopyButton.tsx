import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { useTranslationFn } from '@/hooks';

export const CopyButton = ({
  value,
  id,
  copiedKey,
  onCopy,
}: {
  value: string;
  id: string;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
}) => {
  const t = useTranslationFn();
  const copied = copiedKey === id;
  return (
    <button
      type="button"
      className={`pm-copy-btn${copied ? ' copied' : ''}`}
      onClick={() => onCopy(value, id)}
      title={t('general.copy')}
    >
      {copied ? <CheckOutlined /> : <CopyOutlined />}
    </button>
  );
};
