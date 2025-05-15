import { Descriptions, DescriptionsProps, Flex, Space, Table } from 'antd';
import { Measurement, Quantity } from '@/types/clinPhen/measurement';
import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import OntologyTermComponent from './OntologyTerm';
import type { Resource } from '@/types/clinPhen/resource';
import { Procedure } from '@/types/clinPhen/procedure';
import { EM_DASH } from '@/constants/common';

export const QuantityComponent = ({
  quantity,
  title,
  resources,
}: {
  quantity: Quantity;
  title?: string;
  resources: Resource[];
}) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'Unit',
      label: 'Unit',
      children: <OntologyTermComponent term={quantity.unit} resources={resources} />,
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
            <strong>Unit:</strong> <OntologyTermComponent term={quantity.reference_range.unit} resources={resources} />
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

function MeasurementsExpandedRow({ measurement }: { measurement: Measurement }) {
  const items: DescriptionsProps['items'] = [
    {
      key: 'description',
      label: 'Description',
      children: measurement.description || EM_DASH,
    },
  ];

  return <Descriptions bordered size="small" items={items} />;
}

function MeasurementValue({ measurement, resources }: { measurement: Measurement; resources: Resource[] }) {
  if (measurement?.value) {
    const quantity = measurement.value.quantity;
    return (
      <span>
        {quantity?.value} {quantity?.unit.label}
      </span>
    );
  }
  if (measurement?.complex_value) {
    const COMPLEX_VALUE_COLUMNS = [
      {
        title: 'Type',
        key: 'type',
        dataIndex: 'type',
        render: (type: OntologyTermType) => <OntologyTermComponent term={type} resources={resources} />,
      },
      {
        title: 'Quantity',
        key: 'quantity',
        dataIndex: 'quantity',
        render: (quantity: Quantity) => <QuantityComponent quantity={quantity} resources={resources} />,
      },
    ];

    <Table
      bordered={true}
      pagination={false}
      size="small"
      columns={COMPLEX_VALUE_COLUMNS}
      dataSource={measurement.complex_value.typed_quantities}
    />;
  }
  return null;
}

interface MeasurementsViewProps {
  measurements: Measurement[];
  resources: Resource[];
}

function MeasurementsView({ measurements, resources }: MeasurementsViewProps) {
  const columns = [
    {
      title: 'Assay',
      dataIndex: 'assay',
      key: 'assay',
      render: (assay: OntologyTermType) => <OntologyTermComponent term={assay} resources={resources} />,
    },
    {
      title: 'Measurement Value',
      key: 'value',
      render: (m: Measurement) => <MeasurementValue measurement={m} resources={resources} />,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: any) => text || EM_DASH,
    },
    {
      title: 'Procedure',
      dataIndex: 'procedure',
      key: 'procedure',
      render: (procedure: Procedure | undefined) => (
        <OntologyTermComponent term={procedure?.code} resources={resources} />
      ),
    },
  ];
  return (
    <Table<Measurement>
      dataSource={measurements}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <MeasurementsExpandedRow measurement={record} />,
      }}
      rowKey={(record) => record.assay.id}
    />
  );
}

export default MeasurementsView;
