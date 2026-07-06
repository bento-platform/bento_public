import { normaliseStatus, statusTranslationKey } from '@/features/catalogue/hooks';
import { useTranslationFn } from '@/hooks';
import clsx from 'clsx';

const StatusBadge = ({ status, className }: { status?: string | null; className?: string }) => {
  const t = useTranslationFn();
  const norm = normaliseStatus(status);
  if (!norm) return null;
  return (
    <span className={clsx('status-badge', `status-badge--${norm.toLowerCase()}`, className)}>
      {t(statusTranslationKey(norm))}
    </span>
  );
};

export default StatusBadge;
