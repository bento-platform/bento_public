import { Descriptions, DescriptionsProps, Flex } from 'antd';

import { Quantity } from '@/types/clinPhen/measurement';
import OntologyTerm from '../ClinPhen/OntologyTerm';

const QuantityDisplay = ({ quantity, title }: { quantity: Quantity; title?: string }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'Unit',
      label: 'Unit',
      children: <OntologyTerm term={quantity.unit} />,
    },
    {
      key: 'Value',
      label: 'Value',
      children: quantity.value,
    },
    quantity.reference_range && {
      key: 'Reference Range',
      label: 'Reference Range',
      children: (
        <Flex>
          <div>
            <strong>Unit:</strong> <OntologyTerm term={quantity.reference_range.unit} />
          </div>
          <div>
            <strong>Low:</strong> {quantity.reference_range.low}
          </div>
          <div>
            <strong>High:</strong> {quantity.reference_range.high}
          </div>
        </Flex>
      ),
    },
  ].filter(Boolean) as DescriptionsProps['items'];
  return <Descriptions bordered size="small" items={items} title={title} />;
};

export default QuantityDisplay;
