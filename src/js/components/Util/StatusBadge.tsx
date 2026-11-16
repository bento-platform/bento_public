import { getStatusVariant } from '@/features/catalogue/utils';
import { useTranslationFn } from '@/hooks';

const StatusBadge = ({ status }: { status?: string | null }) => {
  const t = useTranslationFn();
  const label = status || t('provenance.status.unassigned');
  const variant = getStatusVariant(status, t);
  return <span className={`status-badge status-badge--${variant}`}>{label}</span>;
};

export default StatusBadge;
