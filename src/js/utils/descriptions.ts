import { type DescriptionsProps } from 'antd';
import { type ConditionalDescriptionItem } from '@/types/descriptions';

export const hiddenDescriptions = (items: ConditionalDescriptionItem[]): DescriptionsProps['items'] => {
  return items
    .filter(({ isVisible, children }) => (isVisible === undefined ? !!children : !!isVisible))
    .map(({ isVisible: _, ...rest }) => rest);
};
