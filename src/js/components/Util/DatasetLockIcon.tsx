import { Tooltip } from 'antd';
import { ExportOutlined, LockOutlined } from '@ant-design/icons';

import { DATASET_LOCK_ICON_ENABLED } from '@/config';
import { useTranslationFn } from '@/hooks';
import { useApplyForAccessUrl } from '@/hooks/useApplyForAccessUrl';
import { useIsDatasetLocked } from '@/hooks/useDatasetAccess';

type DatasetLockIconProps = {
  project: string;
  dataset: string;
  applyVia: 'button' | 'link';
  className?: string;
};

const LockedDatasetIcon = ({ project, dataset, applyVia, className }: DatasetLockIconProps) => {
  const t = useTranslationFn();
  const locked = useIsDatasetLocked(project, dataset);
  const applyForAccessUrl = useApplyForAccessUrl();
  if (!locked) return null;

  const title =
    applyVia === 'button' ? (
      t('dataset.locked_apply_below')
    ) : (
      <>
        {t('dataset.locked_sentence')}{' '}
        <a
          href={applyForAccessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dataset-lock-tooltip__link"
          // React events bubble through the tooltip portal: don't trigger a parent link (e.g. a breadcrumb item).
          onClick={(e) => e.stopPropagation()}
        >
          {t('dataset.apply_for_access_link')} <ExportOutlined aria-hidden="true" />
        </a>
      </>
    );

  return (
    <Tooltip title={title}>
      <LockOutlined className={className} aria-label={t('dataset.locked')} />
    </Tooltip>
  );
};

/**
 * Lock icon, with a tooltip on how to apply for access, for a dataset the user cannot access (see useIsDatasetLocked);
 * renders nothing otherwise. Only enabled if APPLY_FOR_ACCESS_URL is set (see DATASET_LOCK_ICON_ENABLED); when it is
 * not, the permission hooks do not run.
 * @param applyVia - How the tooltip tells the user to apply for access: 'button' points to the Apply for Access button
 *                   below; 'link' gives a link in the tooltip.
 */
const DatasetLockIcon = (props: DatasetLockIconProps) =>
  DATASET_LOCK_ICON_ENABLED ? <LockedDatasetIcon {...props} /> : null;

export default DatasetLockIcon;
