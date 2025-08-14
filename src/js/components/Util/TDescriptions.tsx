import { memo, useMemo } from 'react';
import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { useTranslatedDescriptionItems } from '@/hooks/useTranslatedDescriptionItems';
import { hiddenDescriptions } from '@/utils/descriptions';

interface TDescriptionsProps extends Omit<DescriptionsProps, 'items'> {
  items: ConditionalDescriptionItem[];
}

const TDescriptions = memo(
  ({ items, ...restProps }: TDescriptionsProps) => {
    const filteredItems = useMemo(() => hiddenDescriptions(items), [items]);
    const descriptionItems = useTranslatedDescriptionItems(filteredItems);

    console.log('hi');

    if (!filteredItems?.length) return null;
    return <Descriptions {...restProps} items={descriptionItems} />;
  },
  (prev, next) => prev.items.length === next.items.length && prev.items.every((it, i) => it.key === next.items[i].key)
);

export default TDescriptions;
