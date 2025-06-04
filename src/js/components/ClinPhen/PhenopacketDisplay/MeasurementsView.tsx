import { DescriptionsProps, Space, Table } from 'antd';

import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';
import QuantityDisplay from '@Util/ClinPhen/QuantityDisplay';

import type { Measurement, Quantity, TypedQuantity } from '@/types/clinPhen/measurement';
import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import type { Procedure } from '@/types/clinPhen/procedure';

import { EM_DASH } from '@/constants/common';
import { ProcedureComponent } from './MedicalActionsView';
import TDescriptions from '@/components/Util/TDescriptions';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { useTranslationFn } from '@/hooks';

const MeasurementsExpandedRow = ({ measurement }: { measurement: Measurement }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'measurement_value',
      label: 'measurements.measurement_value',
      children: <MeasurementDetail measurement={measurement} expanded />,
    },
    {
      key: 'procedure',
      label: 'measurements.procedure',
      children: measurement?.procedure ? <ProcedureComponent procedure={measurement.procedure} /> : EM_DASH,
    },
  ];

  return <TDescriptions bordered size="small" items={items} column={1} />;
};

const MeasurementDetail = ({ measurement, expanded }: { measurement: Measurement; expanded?: boolean }) => {
  const t = useTranslationFn();

  const value = measurement?.value;
  const complexValue = measurement?.complex_value;
  if (!expanded) {
    if (measurement?.value) {
      const quantity = measurement.value.quantity;
      return (
        <span>
          {quantity?.value} {t(quantity?.unit.label || '')}
        </span>
      );
    }
    if (measurement?.complex_value) {
      const { typed_quantities } = measurement.complex_value;

      return (
        <Space direction="vertical" size={0}>
          {typed_quantities.map((typedQuantity, index) => (
            <span key={index}>
              {t(typedQuantity.type.label)}: {typedQuantity.quantity.value} {t(typedQuantity.quantity.unit.label)}
            </span>
          ))}
        </Space>
      );
    }
  } else {
    if (value) {
      return (
        <>
          {value?.quantity && <QuantityDisplay quantity={value.quantity} />}
          {value?.ontology_class && <OntologyTermComponent term={value.ontology_class as OntologyTermType} />}
        </>
      );
    }
    if (complexValue) {
      return (
        <Table<TypedQuantity>
          dataSource={complexValue.typed_quantities}
          columns={[
            {
              title: 'Type',
              dataIndex: 'type',
              key: 'type',
              render: (type: OntologyTermType) => <OntologyTermComponent term={type} />,
            },
            {
              title: 'Value',
              dataIndex: 'quantity',
              key: 'quantity',
              render: (quantity: Quantity) => <QuantityDisplay quantity={quantity} />,
            },
          ]}
          size="small"
          pagination={false}
        />
      );
    }
  }
  return null;
};

interface MeasurementsViewProps {
  measurements: Measurement[];
}

const MeasurementsView = ({ measurements }: MeasurementsViewProps) => {
  const t = useTranslationFn();

  const columns = useTranslatedTableColumnTitles<Measurement>([
    {
      title: 'measurements.assay',
      dataIndex: 'assay',
      key: 'assay',
      render: (assay: OntologyTermType) => <OntologyTermComponent term={assay} />,
    },
    {
      title: 'measurements.measurement_value',
      key: 'value',
      render: (m: Measurement) => <MeasurementDetail measurement={m} />,
    },
    {
      title: 'measurements.description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string | undefined) => t(text) || EM_DASH,
    },
    {
      title: 'measurements.procedure',
      dataIndex: 'procedure',
      key: 'procedure',
      render: (procedure: Procedure | undefined) => <OntologyTermComponent term={procedure?.code} />,
    },
  ]);
  return (
    <Table<Measurement>
      dataSource={measurements}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <MeasurementsExpandedRow measurement={record} />,
      }}
      rowKey={(record) => record.assay.id}
      pagination={false}
    />
  );
};

export default MeasurementsView;
