import { Descriptions, DescriptionsProps, Flex, Table } from 'antd';
import { Measurement, Quantity } from '@/types/clinPhen/measurement';
import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import OntologyTermComponent from '../OntologyTerm';
import { Procedure } from '@/types/clinPhen/procedure';
import { EM_DASH } from '@/constants/common';
import QuantityDisplay from '../../Util/QuantityDisplay';

const MeasurementsExpandedRow = ({ measurement }: { measurement: Measurement }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'description',
      label: 'Description',
      children: measurement.description || EM_DASH,
    },
  ];

  return <Descriptions bordered size="small" items={items} />;
};

function MeasurementValue({ measurement }: { measurement: Measurement }) {
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
        render: (type: OntologyTermType) => <OntologyTermComponent term={type} />,
      },
      {
        title: 'Quantity',
        key: 'quantity',
        dataIndex: 'quantity',
        render: (quantity: Quantity) => <QuantityDisplay quantity={quantity} />,
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
}

const MeasurementsView = ({ measurements }: MeasurementsViewProps) => {
  const columns = [
    {
      title: 'Assay',
      dataIndex: 'assay',
      key: 'assay',
      render: (assay: OntologyTermType) => <OntologyTermComponent term={assay} />,
    },
    {
      title: 'Measurement Value',
      key: 'value',
      render: (m: Measurement) => <MeasurementValue measurement={m} />,
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
      render: (procedure: Procedure | undefined) => <OntologyTermComponent term={procedure?.code} />,
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
};

export default MeasurementsView;
