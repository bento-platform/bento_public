import { Tooltip } from 'antd';
import { LockOutlined } from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import { useIsDatasetLocked } from '@/hooks/useDatasetAccess';

/**
 * Lock icon, with a tooltip, for a dataset the user cannot access (see useIsDatasetLocked); renders nothing otherwise.
 * A separate component, so the permission hooks stay out of the components that render it.
 */
const DatasetLockIcon = ({ project, dataset, className }: { project: string; dataset: string; className?: string }) => {
  const t = useTranslationFn();
  const locked = useIsDatasetLocked(project, dataset);
  if (!locked) return null;
  return (
    <Tooltip title={t('dataset.locked')}>
      <LockOutlined className={className} aria-label={t('dataset.locked')} />
    </Tooltip>
  );
};

export default DatasetLockIcon;
