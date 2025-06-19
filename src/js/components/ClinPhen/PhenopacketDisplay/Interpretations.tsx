import { Space, Table, Tooltip, Typography } from 'antd';
import { MedicineBoxOutlined, ExperimentOutlined } from '@ant-design/icons';

import CustomEmpty from '@Util/CustomEmpty';
import OntologyTerm from '@Util/ClinPhen/OntologyTerm';
import { GeneDescriptor, VariantInterpretation } from '@Util/ClinPhen/InterpretationUtilities';
import TDescriptions from '@Util/TDescriptions';
import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';

import { useTranslationFn } from '@/hooks';
import { addVisibilityProperty, visibilityReducer, visibilitySelector } from '@/utils/tables';

import type { Interpretation } from '@/types/clinPhen/interpretation';
import type { JSONObject } from '@/types/json';
import type { GenomicInterpretation } from '@/types/clinPhen/genomicInterpretation';
import type { ConditionalDescriptionItem } from '@/types/descriptions';
import type { WithVisible } from '@/types/util';

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

  const columns = useTranslatedTableColumnTitles<GenomicInterpretation>([
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
  ]);

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
          <Table<GenomicInterpretation>
            columns={columns}
            dataSource={interpretation.diagnosis.genomic_interpretations}
            expandable={{
              expandedRowRender: (record) => <GenomicInterpretationDetails genomicInterpretation={record} />,
              rowExpandable: (record) => isGenomicInterpretationDetailsVisible(record),
            }}
            rowKey={(record) => record.subject_or_biosample_id}
            pagination={false}
            bordered
          />
        ) : (
          <CustomEmpty text={t('interpretations.no_genomic_iterpretation')} />
        )}
      </div>
    </Space>
  );
};

const isinterpretaionExpandedRowVisible = (r: Interpretation) =>
  !!(r.diagnosis?.disease || r.diagnosis?.genomic_interpretations?.length);

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

  const interpretationsWithVisibility = addVisibilityProperty(interpretations, isinterpretaionExpandedRowVisible);

  return (
    <Table<WithVisible<Interpretation>>
      dataSource={interpretationsWithVisibility}
      columns={columns}
      expandable={{
        expandedRowRender: (record) => <InterpretationsExpandedRow interpretation={record} />,
        rowExpandable: visibilitySelector,
        showExpandColumn: visibilityReducer(interpretationsWithVisibility),
      }}
      rowKey={(record) => record.id}
      pagination={false}
      bordered
    />
  );
};

export default InterpretationsView;
