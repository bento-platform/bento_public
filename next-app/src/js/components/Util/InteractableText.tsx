import { Typography } from 'antd';
import { type TextProps } from 'antd/es/typography/Text';
import clsx from 'clsx';

const { Text } = Typography;

const InteractableText = ({ children, className, ...props }: TextProps) => (
  <Text className={clsx('underline decoration-dotted', className)} {...props}>
    {children}
  </Text>
);

export default InteractableText;
