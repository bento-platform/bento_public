import { Typography } from 'antd';
import { type TextProps } from 'antd/es/typography/Text';

const { Text } = Typography;

const InteractableText = ({children, ...props}: TextProps) => {
    return <Text className='dotted-underline' {...props}>
        {children}
    </Text>
};

export default InteractableText;