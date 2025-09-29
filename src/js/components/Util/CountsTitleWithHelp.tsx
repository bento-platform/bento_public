import type { ReactNode } from 'react';
import { Popover, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import type { BentoEntity } from '@/types/entities';

const CountsHelpPopoverText = ({ children }: { children: ReactNode }) => (
  <div style={{ maxWidth: 360 }}>{children}</div>
);

const CountsTitleWithHelp = ({ entity, showHelp }: CountsHelpProps) => {
  const t = useTranslationFn();

  showHelp = showHelp ?? true; // If undefined, we should show help by default.

  const title = t(`entities.${entity}`, T_PLURAL_COUNT);

  return (
    <Space className="counts-title">
      <span className="counts-title__text">{title}</span>
      {showHelp && (
        <Popover
          title={title}
          content={<CountsHelpPopoverText>{t(`entities.${entity}_help`, { joinArrays: ' ' })}</CountsHelpPopoverText>}
        >
          <InfoCircleOutlined />
        </Popover>
      )}
    </Space>
  );
};

type CountsHelpProps = {
  entity: BentoEntity;
  showHelp?: boolean;
};

export default CountsTitleWithHelp;
