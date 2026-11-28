import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { useFormatNumber, useTranslationFn } from '@/hooks';

/**
 * Info icon with a popover that explains that counts are rounded.
 * - With `rounding`: the counts come from one scope, so the text gives the rounding value.
 * - Without `rounding`: the counts add up several scopes, which can round differently, so the text is general.
 * The parent decides whether to render it.
 */
const RoundedCountsInfo = ({ rounding, className }: RoundedCountsInfoProps) => {
  const t = useTranslationFn();
  const fmt = useFormatNumber();

  const helpText =
    rounding === undefined ? t('rounded_counts.help_mixed') : t('rounded_counts.help', { rounding: fmt(rounding) });

  return (
    <Popover
      title={t('rounded_counts.help_title')}
      content={<div style={{ maxWidth: 360 }}>{helpText}</div>}
      trigger={['hover', 'focus', 'click']}
    >
      <InfoCircleOutlined
        className={className}
        role="button"
        tabIndex={0}
        aria-label={`${t('rounded_counts.help_title')}: ${helpText}`}
        style={{ cursor: 'help' }}
      />
    </Popover>
  );
};

type RoundedCountsInfoProps = {
  rounding?: number;
  className?: string;
};

export default RoundedCountsInfo;
