import { Descriptions, DescriptionsProps, Space, Table } from 'antd';
import { Measurement } from '@/types/clinPhen/measurement';
import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import OntologyTermComponent from './OntologyTerm';
import type { Resource } from '@/types/clinPhen/resource';
import { Procedure } from '@/types/clinPhen/procedure';
import { EM_DASH } from '@/constants/common';

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
    const { typed_quantities } = measurement.complex_value;
    return (
      <Space direction="vertical" size={0}>
        {typed_quantities.map((typedQuantity, index) => (
          <span key={index}>
            {typedQuantity.type.label}: {typedQuantity.quantity.value} {typedQuantity.quantity.unit.label}
          </span>
        ))}
      </Space>
    );
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
      render: (procedure: Procedure | undefined) =>
        procedure ? <OntologyTermComponent term={procedure.code} resources={resources} /> : EM_DASH,
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
