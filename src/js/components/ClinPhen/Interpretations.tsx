import { Descriptions, DescriptionsProps, Space, Table, Tooltip, Typography } from 'antd';
import { Interpretation } from '@/types/clinPhen/interpretation';
import { ExperimentOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import CustomEmpty from '../Util/CustomEmpty';
import OntologyTerm from './OntologyTerm';
import { GenomicInterpretation } from '@/types/clinPhen/genomicInterpretation';
import { JSONObject } from '@/types/json';
import { GeneDescriptor, VariantInterpretation } from './tInterpretationUtilities';

const GenomicInterpretationDetails = ({ genomicInterpretation }: { genomicInterpretation: GenomicInterpretation }) => {
  const relatedType = (genomicInterpretation?.extra_properties as JSONObject)?.__related_type ?? 'unknown';

  const items: DescriptionsProps['items'] = [
    { key: 'id', label: `${relatedType} id`, children: genomicInterpretation.subject_or_biosample_id }, //TODO: Link to subject or biosample
    genomicInterpretation?.variant_interpretation && {
      key: 'Variant Interpretation',
      label: `Variant Interpretation`,
      children: <VariantInterpretation variantInterpretation={genomicInterpretation.variant_interpretation} />,
    },
    genomicInterpretation?.gene_descriptor && {
      key: 'Gene Descriptor',
      label: 'Gene Descriptor',
      children: <GeneDescriptor geneDescriptor={genomicInterpretation.gene_descriptor} />,
    },
  ].filter(Boolean) as DescriptionsProps['items'];

  return <Descriptions items={items} size="small" column={1} bordered />;
};

const InterpretationsExpandedRow = ({ interpretation }: { interpretation: Interpretation }) => {
  const items: DescriptionsProps['items'] = [
    { key: 'Disease', label: 'Disease', children: <OntologyTerm term={interpretation?.diagnosis?.disease} /> },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Subject or Biosample ID',
      dataIndex: 'subject_or_biosample_id',
      key: 'subject_or_biosample_id',
    },
    { title: 'Interpretation Status', dataIndex: 'interpretation_status', key: 'interpretation_status' },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={4}>
          <MedicineBoxOutlined /> Diagnosis
        </Typography.Title>
        {interpretation?.diagnosis?.disease ? (
          <Descriptions items={items} size="small" bordered />
        ) : (
          <CustomEmpty text="No diagnosis" />
        )}
      </div>
      <div>
        <Typography.Title level={4}>
          <ExperimentOutlined /> Genomic Interpretations
        </Typography.Title>
        {interpretation?.diagnosis?.genomic_interpretations?.length ? (
          <Table<GenomicInterpretation>
            columns={columns}
            dataSource={interpretation.diagnosis.genomic_interpretations}
            expandable={{
              expandedRowRender: (record) => <GenomicInterpretationDetails genomicInterpretation={record} />,
            }}
            rowKey={(record) => record.subject_or_biosample_id}
            pagination={false}
          />
        ) : (
          <CustomEmpty text="No Genomic Iterpretation" />
        )}
      </div>
    </Space>
  );
};

interface InterpretationsViewProps {
  interpretations: Interpretation[];
}

const InterpretationsView = ({ interpretations }: InterpretationsViewProps) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      render: (text: string) => <Tooltip title={text}>{new Date(text).toLocaleDateString()}</Tooltip>,
    },
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
      render: (text: string) => <Tooltip title={text}>{new Date(text).toLocaleDateString()}</Tooltip>,
    },
    {
      title: 'Progress Status',
      dataIndex: 'progress_status',
      key: 'progress_status',
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
    },
  ];

  return (
    <Table<Interpretation>
      dataSource={interpretations}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <InterpretationsExpandedRow interpretation={record} />,
      }}
      rowKey={(record) => record.id}
      pagination={false}
    />
  );
};

export default InterpretationsView;
