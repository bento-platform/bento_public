import { useCallback } from 'react';
import { Alert, Space } from 'antd';

import { useUiState } from '@/features/ui/hooks';
import { dismissRoundedCountsNotice } from '@/features/ui/ui.store';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useScopeCountRounding } from '@/hooks/censorship';
import RoundedCountsInfo from './RoundedCountsInfo';

/**
 * Tells the user that the counts on the page are approximate, when Katsu rounds them in the current scope
 * (count_rounding > 1 and no query:data permission). Renders nothing otherwise. Once closed, it stays closed until the
 * page reloads.
 */
const RoundedCountsNotice = ({ className }: { className?: string }) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();

  const rounding = useScopeCountRounding();
  const { roundedCountsNoticeDismissed } = useUiState();

  const onDismiss = useCallback(() => dispatch(dismissRoundedCountsNotice()), [dispatch]);

  if (rounding === null || roundedCountsNoticeDismissed) return null;

  return (
    <Alert
      className={className}
      type="info"
      title={
        <Space size={6}>
          <span>{t('rounded_counts.notice')}</span>
          <RoundedCountsInfo rounding={rounding} />
        </Space>
      }
      closable={{ afterClose: onDismiss, 'aria-label': t('rounded_counts.dismiss') }}
    />
  );
};

export default RoundedCountsNotice;
