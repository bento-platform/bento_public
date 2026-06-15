import { Flex, Typography } from 'antd';

const { Text } = Typography;

const CountItem = ({ icon, value }: { icon: React.ReactNode; value: number }) => (
  <Flex align="center" gap={4}>
    <span className="count-item__icon">{icon}</span>
    <Text className="count-item__text">{value.toLocaleString()}</Text>
  </Flex>
);

export default CountItem;
