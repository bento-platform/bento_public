import { memo } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const OptionDescription = memo(({ description }: OptionDescriptionProps) => (
  <Tooltip placement="top" title={description}>
    <InfoCircleOutlined />
  </Tooltip>
));
OptionDescription.displayName = 'OptionDescription';

interface OptionDescriptionProps {
  description: string;
}

export default OptionDescription;
