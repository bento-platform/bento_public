import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

import { useTranslatedDescriptionItems } from '@/hooks/useTranslatedDescriptionItems';

// T stands for Translated
const TDescriptions = (props: DescriptionsProps) => {
  const { items, ...restProps } = props;

  const descriptionItems = useTranslatedDescriptionItems(items);

  return <Descriptions {...restProps} items={descriptionItems} />;
};

export default TDescriptions;
