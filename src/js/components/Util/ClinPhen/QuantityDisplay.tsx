import { Flex } from 'antd';

import OntologyTerm from './OntologyTerm';
import TDescriptions from '../TDescriptions';

import type { DescriptionsProps } from 'antd';
import { Quantity } from '@/types/clinPhen/measurement';
import { useTranslationFn } from '@/hooks';

const QuantityDisplay = ({ quantity, title }: { quantity: Quantity; title?: string }) => {
  const t = useTranslationFn();

  const items: DescriptionsProps['items'] = [
    {
      key: 'Unit',
      label: 'quantity.unit',
      children: <OntologyTerm term={quantity.unit} />,
    },
    {
      key: 'Value',
      label: 'quantity.value',
      children: quantity.value,
    },
    quantity.reference_range && {
      key: 'Reference Range',
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
  return <TDescriptions bordered size="small" items={items} title={title} />;
};

export default QuantityDisplay;
