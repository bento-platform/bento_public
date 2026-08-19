import { type DescriptionsProps } from 'antd';
import { type ConditionalDescriptionItem } from '@/types/descriptions';

const _defaultIsVisible = (item: ConditionalDescriptionItem) => !!item.children || item.children === 0;

export const hiddenDescriptions = (
  items: ConditionalDescriptionItem[]
): Exclude<DescriptionsProps['items'], undefined> =>
  items
    .filter((item) => ('isVisible' in item ? !!item.isVisible : _defaultIsVisible(item)))
    .map(({ isVisible: _, ...rest }) => rest);
