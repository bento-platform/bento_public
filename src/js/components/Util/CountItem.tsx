import type { ReactNode } from 'react';

import { Flex, type FlexProps, Typography } from 'antd';

const { Text } = Typography;

type CountItemProps = { icon: ReactNode; value: ReactNode } & Omit<FlexProps, 'align' | 'gap'>;

const CountItem = ({ icon, value, ...props }: CountItemProps) => (
  <Flex align="center" gap={4} {...props}>
    <span className="count-item__icon">{icon}</span>
    <Text className="count-item__text">{value}</Text>
  </Flex>
);

export default CountItem;
