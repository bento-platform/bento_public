import { type DescriptionsProps } from 'antd';
import { type ConditionalDescriptionItem } from '@/types/descriptions';

export const hiddenDescriptions = (
  items: ConditionalDescriptionItem[]
): Exclude<DescriptionsProps['items'], undefined> =>
  items
    .filter((item) => ('isVisible' in item ? !!item.isVisible : !!item.children))
    .map(({ isVisible: _, ...rest }) => rest);
