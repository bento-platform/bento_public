import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { useTranslatedDescriptionItems } from '@/hooks/useTranslatedDescriptionItems';
import { hiddenDescriptions } from '@/utils/descriptions';

interface TDescriptionsProps extends Omit<DescriptionsProps, 'items'> {
  items: ConditionalDescriptionItem[];
}

// T stands for Translated
const TDescriptions = ({ items, ...restProps }: TDescriptionsProps) => {
  const filteredItems = hiddenDescriptions(items);

  const descriptionItems = useTranslatedDescriptionItems(filteredItems);

  if (filteredItems?.length === 0) {
    return null;
  }

  return <Descriptions {...restProps} items={descriptionItems} />;
};

export default TDescriptions;
