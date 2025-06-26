import { Space, Tooltip, Typography } from 'antd';
import { MedicineBoxOutlined, ExperimentOutlined } from '@ant-design/icons';

import CustomEmpty from '@Util/CustomEmpty';
import OntologyTerm from '@Util/ClinPhen/OntologyTerm';
import { GeneDescriptor, VariantInterpretation } from '@Util/ClinPhen/InterpretationUtilities';
import TDescriptions from '@Util/TDescriptions';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';

import { useTranslationFn } from '@/hooks';

import type { Interpretation } from '@/types/clinPhen/interpretation';
import type { JSONObject } from '@/types/json';
import type { GenomicInterpretation } from '@/types/clinPhen/genomicInterpretation';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

const GenomicInterpretationDetails = ({ genomicInterpretation }: { genomicInterpretation: GenomicInterpretation }) => {
  const relatedType = (genomicInterpretation?.extra_properties as JSONObject)?.__related_type ?? 'unknown';

  const items: ConditionalDescriptionItem[] = [
    { key: 'id', label: `${relatedType} id`, children: genomicInterpretation.subject_or_biosample_id! }, //TODO: Link to subject or biosample
    {
      key: 'Variant Interpretation',
      label: 'interpretations.variant_interpretation',
      children: <VariantInterpretation variantInterpretation={genomicInterpretation.variant_interpretation!} />,
      isVisible: genomicInterpretation.variant_interpretation,
    },
    {
      key: 'Gene Descriptor',
      label: 'interpretations.gene_descriptor',
      children: <GeneDescriptor geneDescriptor={genomicInterpretation.gene_descriptor!} />,
      isVisible: genomicInterpretation.gene_descriptor,
    },
  ];

  return <TDescriptions items={items} size="small" column={1} bordered />;
};

const isGenomicInterpretationDetailsVisible = (r: GenomicInterpretation) =>
  !!(r.variant_interpretation || r.gene_descriptor);

const InterpretationsExpandedRow = ({ interpretation }: { interpretation: Interpretation }) => {
  const t = useTranslationFn();

  const items: ConditionalDescriptionItem[] = [
    {
      key: 'Disease',
      label: 'interpretations.disease',
      children: <OntologyTerm term={interpretation?.diagnosis?.disease} />,
      isVisible: interpretation?.diagnosis?.disease,
    },
  ];

  const columns = [
    {
      title: 'interpretations.id',
      dataIndex: 'id',
    },
    {
      title: 'interpretations.subject_or_biosample_id',
      dataIndex: 'subject_or_biosample_id',
    },
    {
      title: 'interpretations.interpretation_status',
      dataIndex: 'interpretation_status',
      render: (text: string) => t(`genomic_intepretation_status.${text}`),
    },
  ];

  return (
    <Space direction="vertical" size="large" className="w-full">
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
          <CustomTable<GenomicInterpretation>
            columns={columns}
            dataSource={interpretation.diagnosis.genomic_interpretations}
            expandedRowRender={(record: GenomicInterpretation) => (
              <GenomicInterpretationDetails genomicInterpretation={record} />
            )}
            rowKey={(record: GenomicInterpretation) => record.subject_or_biosample_id}
            isDataKeyVisible={isGenomicInterpretationDetailsVisible}
          />
        ) : (
          <CustomEmpty text={t('interpretations.no_genomic_iterpretation')} />
        )}
      </div>
    </Space>
  );
};

const isInterpretationDetailsVisible = (r: Interpretation) =>
  !!(r.diagnosis?.disease || r.diagnosis?.genomic_interpretations?.length);

interface InterpretationsViewProps {
  interpretations: Interpretation[];
}

const InterpretationsView = ({ interpretations }: InterpretationsViewProps) => {
  const t = useTranslationFn();

  const columns: CustomTableColumns<Interpretation> = [
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
      isEmptyDefaultCheck: true,
    },
    {
      title: 'interpretations.updated',
      dataIndex: 'updated',
      key: 'updated',
      render: (text: string) => <Tooltip title={text}>{new Date(text).toLocaleDateString()}</Tooltip>,
      isEmptyDefaultCheck: true,
    },
    {
      title: 'interpretations.progress_status',
      dataIndex: 'progress_status',
      key: 'progress_status',
      render: (text: string) => t(`progress_status.${text}`),
      isEmptyDefaultCheck: true,
    },
    {
      title: 'interpretations.summary',
      dataIndex: 'summary',
      key: 'summary',
      render: (text: string) => t(text),
      isEmptyDefaultCheck: true,
    },
  ];

  return (
    <CustomTable<Interpretation>
      dataSource={interpretations}
      columns={columns}
      expandedRowRender={(record) => <InterpretationsExpandedRow interpretation={record} />}
      rowKey={(record) => record.id}
      isDataKeyVisible={isInterpretationDetailsVisible}
    />
  );
};

export default InterpretationsView;
