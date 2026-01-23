import { Space, Table } from 'antd';

import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';
import QuantityDisplay from '@Util/ClinPhen/QuantityDisplay';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import ProcedureComponent from '@/components/Util/ClinPhen/Procedure';

import type { TableColumnsType } from 'antd';
import type { Measurement, Quantity, TypedQuantity } from '@/types/clinPhen/measurement';
import type { OntologyTerm as OntologyTermType } from '@/types/ontology';
import type { Procedure } from '@/types/clinPhen/procedure';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import { addId, type WithId } from '@/utils/arrays';
import { EM_DASH } from '@/constants/common';
import TDescriptions from '@Util/TDescriptions';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { useTranslationFn } from '@/hooks';

type TypedQuantityWithId = WithId<TypedQuantity>;

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
      children: <ProcedureComponent procedure={measurement.procedure} />,
      isVisible: measurement.procedure,
    },
  ];

  return <TDescriptions bordered size="compact" items={items} column={1} />;
};

const MeasurementDetail = ({ measurement, expanded }: { measurement: Measurement; expanded?: boolean }) => {
  const complexValueColumns: TableColumnsType<TypedQuantityWithId> =
    useTranslatedTableColumnTitles<TypedQuantityWithId>([
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
  const complexValueTypedQuantities = addId(measurement?.complex_value?.typed_quantities || []);
  if (!expanded) {
    if (measurement.value) {
      // Measurement value (simple) is either { quantity } or { ontology_class }:
      if ('quantity' in measurement.value) {
        const quantity = measurement.value.quantity;
        return (
          <span>
            {/* Rather than show a link to the ontology term beside the unit, show the link in the tooltip */}
            {quantity.value}{' '}
            <OntologyTermComponent term={quantity.unit} tooltipLink={true} style={{ textDecoration: 'underline' }} />
          </span>
        );
      } else {
        return <OntologyTermComponent term={measurement.value.ontology_class} />;
      }
    }
    if (measurement.complex_value) {
      return (
        <Space direction="vertical" size={0}>
          {complexValueTypedQuantities.map((typedQuantity) => (
            <span key={typedQuantity.id}>
              <OntologyTermComponent
                term={typedQuantity.type}
                suffix=":"
                tooltipLink={true}
                style={{ textDecoration: 'underline' }}
              />{' '}
              {typedQuantity.quantity.value}{' '}
              <OntologyTermComponent
                term={typedQuantity.quantity.unit}
                tooltipLink={true}
                style={{ textDecoration: 'underline' }}
              />
            </span>
          ))}
        </Space>
      );
    }
  } else {
    if (value) {
      return (
        <>
          {'quantity' in value ? (
            <QuantityDisplay quantity={value.quantity} />
          ) : (
            <OntologyTermComponent term={value.ontology_class} />
          )}
        </>
      );
    }
    if (complexValueTypedQuantities) {
      return (
        <Table<TypedQuantityWithId>
          dataSource={complexValueTypedQuantities}
          columns={complexValueColumns}
          size="small"
          pagination={false}
          rowKey={(record) => record.id}
          bordered
        />
      );
    }
  }
  return null;
};

const isMeasurementExpandable = (measurement: Measurement) =>
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
      alwaysShow: true,
    },
    {
      title: 'measurements.measurement_value',
      key: 'value',
      render: (m: Measurement) => <MeasurementDetail measurement={m} />,
      alwaysShow: true,
    },
    {
      title: 'measurements.description',
      dataIndex: 'description',
      render: (text: string | undefined) => t(text) || EM_DASH,
    },
    {
      title: 'measurements.procedure',
      dataIndex: 'procedure',
      render: (procedure: Procedure | undefined) => <OntologyTermComponent term={procedure?.code} />,
    },
  ];

  return (
    <CustomTable<Measurement>
      dataSource={measurements}
      columns={columns}
      expandedRowRender={(record) => <MeasurementsExpandedRow measurement={record} />}
      queryKey="measurement"
      rowKey={(record) => record.assay.id}
      isRowExpandable={isMeasurementExpandable}
    />
  );
};

export default MeasurementsView;
