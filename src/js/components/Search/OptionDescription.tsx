import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const OptionDescription = ({ description }: OptionDescriptionProps) => {
  return (
    <Tooltip placement="top" title={description}>
      <QuestionCircleOutlined />
    </Tooltip>
  );
};

interface OptionDescriptionProps {
  description: string;
}

export default OptionDescription;
