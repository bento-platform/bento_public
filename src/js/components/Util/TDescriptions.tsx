import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { useTranslatedDescriptionItems } from '@/hooks/useTranslatedDescriptionItems';
import { hiddenDescriptions } from '@/utils/descriptions';

interface TDescriptionsProps extends Omit<DescriptionsProps, 'items'> {
  items: ConditionalDescriptionItem[];
}

// T stands for Translated
const TDescriptions = (props: TDescriptionsProps) => {
  const { items, ...restProps } = props;
  const filteredItems = hiddenDescriptions(items);

  if (filteredItems?.length === 0) {
    return null;
  }

  const descriptionItems = useTranslatedDescriptionItems(filteredItems);

  return <Descriptions {...restProps} items={descriptionItems} />;
};

export default TDescriptions;
