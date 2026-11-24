import type { ReactNode } from 'react';
import { Tooltip } from 'antd';
import { ExportOutlined, LockOutlined } from '@ant-design/icons';

import { useTranslationFn } from '@/hooks';
import { useApplyForAccessUrl } from '@/hooks/useApplyForAccessUrl';
import { useIsDatasetLocked } from '@/hooks/useDatasetAccess';

/**
 * Lock icon, with a tooltip, for a dataset the user cannot access (see useIsDatasetLocked); renders nothing otherwise.
 * A separate component, so the permission hooks stay out of the components that render it.
 * @param applyVia - How the tooltip tells the user to apply for access, if APPLY_FOR_ACCESS_URL is set: 'button' points
 *                   to the Apply for Access button below; 'link' gives a link in the tooltip.
 */
const DatasetLockIcon = ({
  project,
  dataset,
  applyVia,
  className,
}: {
  project: string;
  dataset: string;
  applyVia: 'button' | 'link';
  className?: string;
}) => {
  const t = useTranslationFn();
  const locked = useIsDatasetLocked(project, dataset);
  const applyForAccessUrl = useApplyForAccessUrl();
  if (!locked) return null;

  let title: ReactNode = t('dataset.locked');
  if (applyForAccessUrl) {
    title =
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
  }

  return (
    <Tooltip title={title}>
      <LockOutlined className={className} aria-label={t('dataset.locked')} />
    </Tooltip>
  );
};

export default DatasetLockIcon;
