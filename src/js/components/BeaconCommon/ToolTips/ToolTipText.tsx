import React from 'react';
import { Typography } from 'antd';
const { Text } = Typography;

export const ToolTipText = ({ children }: { children: string }) => <Text style={{ color: 'white' }}>{children}</Text>;
