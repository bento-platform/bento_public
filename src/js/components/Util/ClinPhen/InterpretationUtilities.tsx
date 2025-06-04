import { type DescriptionsProps, Space, Table } from 'antd';

import StringList from '../StringList';
import TDescriptions from '../TDescriptions';
import OntologyTerm from './OntologyTerm';
import JsonView from '../JsonView';

import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';

import type { VariantInterpretation as VariantInterpretationType } from '@/types/clinPhen/variantInterpretation';
import type { Extension } from '@/types/clinPhen/shared';
import type { Expression } from '@/types/clinPhen/vrs';
import type { JSONType } from '@/types/json';
import type { GeneDescriptor as GeneDescriptorType } from '@/types/clinPhen/geneDescriptor';

export const GeneDescriptor = ({ geneDescriptor }: { geneDescriptor: GeneDescriptorType }) => {
  const items: DescriptionsProps['items'] = [
    { key: 'id', label: 'interpretations.accession_number', children: geneDescriptor.value_id },
    { key: 'symbol', label: 'interpretations.symbol', children: geneDescriptor.symbol },
    { key: 'description', label: 'interpretations.description', children: geneDescriptor.description },
    {
      key: 'alternate_ids',
      label: 'interpretations.alternate_ids',
      children: <StringList list={geneDescriptor.alternate_ids} />,
    },
    { key: 'xrefs', label: 'interpretations.cross_references', children: <StringList list={geneDescriptor.xrefs} /> },
    {
      key: 'alternate_symbols',
      label: 'interpretations.alternate_symbols',
      children: <StringList list={geneDescriptor.alternate_symbols} />,
    },
  ];

  return <TDescriptions items={items} size="small" column={1} bordered />;
};

const VariantExpressionDetails = ({ variantExpression }: { variantExpression: Expression }) => {
  const items: DescriptionsProps['items'] = [
    { key: 'syntax', label: 'interpretations.syntax', children: variantExpression.syntax },
    { key: 'value', label: 'interpretations.value', children: variantExpression.value },
  ];

  return <TDescriptions items={items} size="small" />;
};

export const VariantInterpretation = ({
  variantInterpretation,
}: {
  variantInterpretation: VariantInterpretationType;
}) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 'acmg_pathogenicity_classification',
      label: 'interpretations.acmg_pathogenicity_classification',
      children: variantInterpretation?.acmg_pathogenicity_classification,
    },
    {
      key: 'therapeutic_actionability',
      label: 'interpretations.therapeutic_actionability',
      children: variantInterpretation?.therapeutic_actionability,
    },
  ];

  const vd = variantInterpretation.variation_descriptor;

  const extentionTableColumns = useTranslatedTableColumnTitles<Extension>([
    { title: 'interpretations.name', dataIndex: 'name' },
    { title: 'interpretations.value', dataIndex: 'value' },
  ]);

  const variantDescrptorItems: DescriptionsProps['items'] = [
    { key: 'id', label: 'interpretations.id', children: vd.id },
    vd?.variation && {
      key: 'variation',
      label: 'interpretations.variation',
      children: <JsonView src={vd.variation as unknown as JSONType} />,
    },
    vd?.label && { key: 'label', label: 'interpretations.label', children: vd.label },
    vd?.description && { key: 'description', label: 'interpretations.description', children: vd.description },
    vd?.gene_context && {
      key: 'gene_context',
      label: 'interpretations.gene_context',
      children: <GeneDescriptor geneDescriptor={vd.gene_context} />,
    },
    vd?.expressions && {
      key: 'expressions',
      label: 'interpretations.expressions',
      children: (
        <Space direction="vertical" size="small">
          {vd.expressions.map((e, i) => (
            <VariantExpressionDetails key={i} variantExpression={e} />
          ))}
        </Space>
      ),
    },
    vd?.vcf_record && {
      key: 'vcf_record',
      label: 'interpretations.vcf_record',
      children: <JsonView src={vd.vcf_record as unknown as JSONType} />,
    },
    vd?.xrefs && { key: 'xrefs', label: 'interpretations.xrefs', children: vd.xrefs },
    vd?.alternate_labels && {
      key: 'alternate_labels',
      label: 'interpretations.alternate_labels',
      children: vd.alternate_labels,
    },
    vd?.extensions && {
      key: 'extensions',
      label: 'interpretations.extensions',
      children: <Table<Extension> columns={extentionTableColumns} dataSource={vd.extensions} />,
    },
    vd?.molecule_context && {
      key: 'molecule_context',
      label: 'interpretations.molecule_context',
      children: vd.molecule_context,
    },
    vd?.structural_type && {
      key: 'structural_type',
      label: 'interpretations.structural_type',
      children: <OntologyTerm term={vd.structural_type} />,
    },
    vd?.vrs_ref_allele_seq && {
      key: 'vrs_ref_allele_seq',
      label: 'interpretations.vrs_ref_allele_seq',
      children: vd.vrs_ref_allele_seq,
    },
    vd?.allelic_state && {
      key: 'allelic_state',
      label: 'interpretations.allelic_state',
      children: <OntologyTerm term={vd.allelic_state} />,
    },
  ].filter(Boolean) as DescriptionsProps['items'];

  return (
    <Space direction="vertical">
      <TDescriptions items={items} size="small" bordered />
      <TDescriptions items={variantDescrptorItems} size="small" bordered />
    </Space>
  );
};
