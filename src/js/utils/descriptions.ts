import { type DescriptionsProps } from 'antd';
import { type ConditionalDescriptionItem } from '@/types/descriptions';

export const hiddenDescriptions = (items: ConditionalDescriptionItem[]): DescriptionsProps['items'] => {
  return items
    .filter(({ hidden, children }) => (hidden === undefined ? children : !hidden))
    .map(({ hidden: _, ...rest }) => rest);
};
