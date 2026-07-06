import { normaliseStatus, statusTranslationKey } from '@/features/catalogue/hooks';
import { useTranslationFn } from '@/hooks';

const StatusBadge = ({ status }: { status?: string | null }) => {
  const t = useTranslationFn();
  const norm = normaliseStatus(status);
  if (!norm) return null;
  return <span className={`status-badge status-badge--${norm.toLowerCase()}`}>{t(statusTranslationKey(norm))}</span>;
};

export default StatusBadge;
