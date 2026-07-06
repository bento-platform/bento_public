import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

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
  const copied = copiedKey === id;
  return (
    <button
      type="button"
      className={`pm-copy-btn${copied ? ' copied' : ''}`}
      onClick={() => onCopy(value, id)}
      title="Copy"
    >
      {copied ? <CheckOutlined /> : <CopyOutlined />}
    </button>
  );
};
