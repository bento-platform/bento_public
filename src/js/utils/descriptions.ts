import { DescriptionsItemType } from 'antd/es/descriptions';

type HiddenDescriptionsProps = DescriptionsItemType & {
  hidden?: boolean;
};

export const hiddenDescriptions = (items: HiddenDescriptionsProps[]): DescriptionsItemType[] => {
  return items.filter((item) => !item.hidden).map(({ hidden, ...rest }) => rest);
};
