import { Typography } from 'antd';
import { type TextProps } from 'antd/es/typography/Text';
import clsx from 'clsx/clsx';

const { Text } = Typography;

const InteractableText = ({ children, className, ...props }: TextProps) => {
  return (
    <Text className={clsx('dotted-underline', className)} {...props}>
      {children}
    </Text>
  );
};

export default InteractableText;
