import { type DescriptionsProps, Flex } from 'antd';

import OntologyTerm from './OntologyTerm';
import TDescriptions from '../TDescriptions';

import type { Quantity } from '@/types/clinPhen/measurement';
import { useTranslationFn } from '@/hooks';

const QuantityDisplay = ({ quantity, title }: { quantity: Quantity; title?: string }) => {
  const t = useTranslationFn();

  const items: DescriptionsProps['items'] = [
    {
      key: 'unit',
      label: 'quantity.unit',
      children: <OntologyTerm term={quantity.unit} />,
    },
    {
      key: 'value',
      label: 'quantity.value',
      children: quantity.value,
    },
    quantity.reference_range && {
      key: 'reference_range',
      label: 'Reference Range',
      children: (
        <Flex>
          <div>
            <strong>{t('quantity.unit')}:</strong> <OntologyTerm term={quantity.reference_range.unit} />
          </div>
          <div>
            <strong>{t('quantity.low')}:</strong> {quantity.reference_range.low}
          </div>
          <div>
            <strong>{t('quantity.high')}:</strong> {quantity.reference_range.high}
          </div>
        </Flex>
      ),
    },
  ].filter(Boolean) as DescriptionsProps['items'];
  return <TDescriptions bordered size="small" column={1} items={items} title={title} />;
};

export default QuantityDisplay;
