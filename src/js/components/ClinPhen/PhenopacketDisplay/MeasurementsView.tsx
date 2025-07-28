import { Space, Table } from 'antd';

import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';
import QuantityDisplay from '@Util/ClinPhen/QuantityDisplay';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';

import type { Measurement, Quantity, TypedQuantity } from '@/types/clinPhen/measurement';
import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import type { Procedure } from '@/types/clinPhen/procedure';
import type { ConditionalDescriptionItem } from '@/types/descriptions';
import type { TableColumnsType } from 'antd';

import { EM_DASH } from '@/constants/common';
import { ProcedureComponent } from './MedicalActionsView';
import TDescriptions from '@Util/TDescriptions';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { useTranslationFn } from '@/hooks';

const MeasurementsExpandedRow = ({ measurement }: { measurement: Measurement }) => {
  const items: ConditionalDescriptionItem[] = [
    {
      key: 'measurement_value',
      label: 'measurements.measurement_value',
      children: <MeasurementDetail measurement={measurement} expanded />,
      isVisible: measurement.value || measurement.complex_value,
    },
    {
      key: 'procedure',
      label: 'measurements.procedure',
      children: <ProcedureComponent procedure={measurement.procedure!} />,
      isVisible: measurement.procedure,
    },
  ];

  return <TDescriptions bordered size="small" items={items} column={1} />;
};

const MeasurementDetail = ({ measurement, expanded }: { measurement: Measurement; expanded?: boolean }) => {
  const t = useTranslationFn();

  const complexValueTypedQuantityColumns: TableColumnsType<TypedQuantity> =
    useTranslatedTableColumnTitles<TypedQuantity>([
      {
        title: 'measurements.type',
        dataIndex: 'type',
        render: (type: OntologyTermType) => <OntologyTermComponent term={type} />,
      },
      {
        title: 'measurements.value',
        dataIndex: 'quantity',
        render: (quantity: Quantity) => <QuantityDisplay quantity={quantity} />,
      },
    ]);

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
          columns={complexValueTypedQuantityColumns}
          size="small"
          pagination={false}
          bordered
        />
      );
    }
  }
  return null;
};

const isMeasurementExpandedRowVisible = (measurement: Measurement) =>
  !!(measurement.procedure || measurement.value || measurement.complex_value);
interface MeasurementsViewProps {
  measurements: Measurement[];
}

const MeasurementsView = ({ measurements }: MeasurementsViewProps) => {
  const t = useTranslationFn();

  const columns: CustomTableColumns<Measurement> = [
    {
      title: 'measurements.assay',
      dataIndex: 'assay',
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
      render: (text: string | undefined) => t(text) || EM_DASH,
      isEmptyDefaultCheck: true,
    },
    {
      title: 'measurements.procedure',
      dataIndex: 'procedure',
      render: (procedure: Procedure | undefined) => <OntologyTermComponent term={procedure?.code} />,
      isEmptyDefaultCheck: true,
    },
  ];

  return (
    <CustomTable<Measurement>
      dataSource={measurements}
      columns={columns}
      expandedRowRender={(record) => <MeasurementsExpandedRow measurement={record} />}
      rowKey={(record) => record.assay.id}
      isDataKeyVisible={isMeasurementExpandedRowVisible}
    />
  );
};

export default MeasurementsView;
