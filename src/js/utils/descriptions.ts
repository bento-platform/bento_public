import { type DescriptionsProps } from 'antd';
import { type HiddenDescriptionsProps } from '@/types/descriptions';

export const hiddenDescriptions = (items: HiddenDescriptionsProps[]): DescriptionsProps['items'] => {
  return items
    .filter(({ hidden, children }) => (hidden === undefined ? children : !hidden))
    .map(({ hidden: _, ...rest }) => rest);
};
