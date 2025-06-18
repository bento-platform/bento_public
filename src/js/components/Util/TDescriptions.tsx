import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

import { useTranslatedDescriptionItems } from '@/hooks/useTranslatedDescriptionItems';
import { hiddenDescriptions } from '@/utils/descriptions';
import { HiddenDescriptionsProps } from '@/types/descriptions';

interface TDescriptionsProps extends Omit<DescriptionsProps, 'items'> {
  items: HiddenDescriptionsProps[];
}

// T stands for Translated
const TDescriptions = (props: TDescriptionsProps) => {
  const { items, ...restProps } = props;
  const filteredItems = hiddenDescriptions(items);

  const descriptionItems = useTranslatedDescriptionItems(filteredItems);

  return <Descriptions {...restProps} items={descriptionItems} />;
};

export default TDescriptions;
