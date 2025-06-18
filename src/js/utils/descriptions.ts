import { type DescriptionsItemType } from 'antd/es/descriptions';

interface HiddenDescriptionsProps extends DescriptionsItemType {
  hidden?: boolean;
}

export const hiddenDescriptions = (items: HiddenDescriptionsProps[]): DescriptionsItemType[] => {
  return items.filter((item) => !item.hidden).map(({ hidden: _, ...rest }) => rest);
};
