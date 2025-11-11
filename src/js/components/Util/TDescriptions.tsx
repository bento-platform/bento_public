import { memo, useMemo } from 'react';
import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { useTranslatedDescriptionItems } from '@/hooks/useTranslatedDescriptionItems';
import { hiddenDescriptions } from '@/utils/descriptions';

interface TDescriptionsProps extends Omit<DescriptionsProps, 'items' | 'size'> {
  items: ConditionalDescriptionItem[];
  size?: DescriptionsProps['size'] | 'compact';
}

const TDescriptions = memo(
  ({ items, size, ...restProps }: TDescriptionsProps) => {
    const filteredItems = useMemo(() => hiddenDescriptions(items), [items]);
    const descriptionItems = useTranslatedDescriptionItems(filteredItems);
    const classNames = [];
    let derivedSize: DescriptionsProps['size'] = 'default';

    if (!filteredItems?.length) return null;

    if (size) {
      if (size === 'compact') classNames.push('compact');
      else derivedSize = size;
    }

    return <Descriptions {...restProps} className={classNames.join(' ')} size={derivedSize} items={descriptionItems} />;
  },
  (prev, next) => prev.items.length === next.items.length && prev.items.every((it, i) => it.key === next.items[i].key)
);

TDescriptions.displayName = 'TDescriptions';

export default TDescriptions;
