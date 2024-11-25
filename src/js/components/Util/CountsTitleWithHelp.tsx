import type { ReactNode } from 'react';
import { Popover, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import type { BentoEntity } from '@/types/entities';

const CountsHelpPopoverText = ({ children }: { children: ReactNode }) => (
  <div style={{ maxWidth: 360 }}>{children}</div>
);

const CountsTitleWithHelp = ({ entity }: CountsHelpProps) => {
  const t = useTranslationFn();

  const title = t(`entities.${entity}`, T_PLURAL_COUNT);

  return (
    <Space>
      {title}
      <Popover
        title={title}
        content={<CountsHelpPopoverText>{t(`entities.${entity}_help`, { joinArrays: ' ' })}</CountsHelpPopoverText>}
      >
        <InfoCircleOutlined />
      </Popover>
    </Space>
  );
};

type CountsHelpProps = {
  entity: BentoEntity;
};

export default CountsTitleWithHelp;
