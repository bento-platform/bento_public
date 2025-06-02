import { Space, Table, Tooltip, Typography } from 'antd';
import { MedicineBoxOutlined, ExperimentOutlined } from '@ant-design/icons';

import CustomEmpty from '@Util/CustomEmpty';
import OntologyTerm from '@Util/ClinPhen/OntologyTerm';
import { GeneDescriptor, VariantInterpretation } from '@Util/ClinPhen/InterpretationUtilities';
import TDescriptions from '@/components/Util/TDescriptions';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';

import { useTranslationFn } from '@/hooks';

import type { DescriptionsProps } from 'antd';
import type { Interpretation } from '@/types/clinPhen/interpretation';
import type { JSONObject } from '@/types/json';
import type { GenomicInterpretation } from '@/types/clinPhen/genomicInterpretation';

const GenomicInterpretationDetails = ({ genomicInterpretation }: { genomicInterpretation: GenomicInterpretation }) => {
  const relatedType = (genomicInterpretation?.extra_properties as JSONObject)?.__related_type ?? 'unknown';

  const items: DescriptionsProps['items'] = [
    { key: 'id', label: `${relatedType} id`, children: genomicInterpretation.subject_or_biosample_id }, //TODO: Link to subject or biosample
    genomicInterpretation?.variant_interpretation && {
      key: 'Variant Interpretation',
      label: 'interpretations.variant_interpretation',
      children: <VariantInterpretation variantInterpretation={genomicInterpretation.variant_interpretation} />,
    },
    genomicInterpretation?.gene_descriptor && {
      key: 'Gene Descriptor',
      label: 'interpretations.gene_descriptor',
      children: <GeneDescriptor geneDescriptor={genomicInterpretation.gene_descriptor} />,
    },
  ].filter(Boolean) as DescriptionsProps['items'];

  return <TDescriptions items={items} size="small" column={1} bordered />;
};

const InterpretationsExpandedRow = ({ interpretation }: { interpretation: Interpretation }) => {
  const t = useTranslationFn();

  const items: DescriptionsProps['items'] = [
    {
      key: 'Disease',
      label: 'interpretations.disease',
      children: <OntologyTerm term={interpretation?.diagnosis?.disease} />,
    },
  ];

  const columns = useTranslatedTableColumnTitles<GenomicInterpretation>([
    {
      title: 'interpretations.id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'interpretations.subject_or_biosample_id',
      dataIndex: 'subject_or_biosample_id',
      key: 'subject_or_biosample_id',
    },
    {
      title: 'interpretations.interpretation_status',
      dataIndex: 'interpretation_status',
      key: 'interpretation_status',
      render: (text: string) => t(`genomic_intepretation_status.${text}`),
    },
  ]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={4}>
          <MedicineBoxOutlined /> {t('interpretations.diagnosis')}
        </Typography.Title>
        {interpretation?.diagnosis?.disease ? (
          <TDescriptions items={items} size="small" bordered />
        ) : (
          <CustomEmpty text={t('interpretations.no_diagnosis')} />
        )}
      </div>
      <div>
        <Typography.Title level={4}>
          <ExperimentOutlined /> {t('interpretations.genomic_interpretations')}
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
          <CustomEmpty text={t('interpretations.no_genomic_iterpretation')} />
        )}
      </div>
    </Space>
  );
};

interface InterpretationsViewProps {
  interpretations: Interpretation[];
}

const InterpretationsView = ({ interpretations }: InterpretationsViewProps) => {
  const t = useTranslationFn();

  const columns = useTranslatedTableColumnTitles<Interpretation>([
    {
      title: 'interpretations.id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'interpretations.created',
      dataIndex: 'created',
      key: 'created',
      render: (text: string) => <Tooltip title={text}>{new Date(text).toLocaleDateString()}</Tooltip>,
    },
    {
      title: 'interpretations.updated',
      dataIndex: 'updated',
      key: 'updated',
      render: (text: string) => <Tooltip title={text}>{new Date(text).toLocaleDateString()}</Tooltip>,
    },
    {
      title: 'interpretations.progress_status',
      dataIndex: 'progress_status',
      key: 'progress_status',
      render: (text: string) => t(`progress_status.${text}`),
    },
    {
      title: 'interpretations.summary',
      dataIndex: 'summary',
      key: 'summary',
      render: (text: string) => t(text),
    },
  ]);

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
