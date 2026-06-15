import type { ReactNode } from 'react';

import { Flex, Typography } from 'antd';

const { Text } = Typography;

const CountItem = ({ icon, value, className }: { icon: ReactNode; value: ReactNode; className?: string }) => (
  <Flex align="center" gap={4} className={className}>
    <span className="count-item__icon">{icon}</span>
    <Text className="count-item__text">{value}</Text>
  </Flex>
);

export default CountItem;
