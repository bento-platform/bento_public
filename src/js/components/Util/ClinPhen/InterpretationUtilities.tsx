import { Space, Table } from 'antd';

import StringList from '../StringList';
import TDescriptions from '../TDescriptions';
import OntologyTerm from './OntologyTerm';
import JsonView from '../JsonView';

import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';
import { objectToBoolean } from '@/utils/boolean';

import type { VariantInterpretation as VariantInterpretationType } from '@/types/clinPhen/variantInterpretation';
import type { Extension } from '@/types/clinPhen/shared';
import type { Expression } from '@/types/clinPhen/vrs';
import type { JSONType } from '@/types/json';
import type { GeneDescriptor as GeneDescriptorType } from '@/types/clinPhen/geneDescriptor';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

export const GeneDescriptor = ({ geneDescriptor }: { geneDescriptor: GeneDescriptorType }) => {
  const items: ConditionalDescriptionItem[] = [
    { key: 'id', label: 'interpretations.accession_number', children: geneDescriptor.value_id },
    { key: 'symbol', label: 'interpretations.symbol', children: geneDescriptor.symbol },
    { key: 'description', label: 'interpretations.description', children: geneDescriptor.description },
    {
      key: 'alternate_ids',
      label: 'interpretations.alternate_ids',
      children: <StringList list={geneDescriptor.alternate_ids} />,
      isVisible: geneDescriptor.alternate_ids?.length,
    },
    {
      key: 'xrefs',
      label: 'interpretations.cross_references',
      children: <StringList list={geneDescriptor.xrefs} />,
      isVisible: geneDescriptor.xrefs?.length,
    },
    {
      key: 'alternate_symbols',
      label: 'interpretations.alternate_symbols',
      children: <StringList list={geneDescriptor.alternate_symbols} />,
      isVisible: geneDescriptor.alternate_symbols?.length,
    },
  ];

  return <TDescriptions items={items} size="small" column={1} bordered />;
};

const VariantExpressionDetails = ({ variantExpression }: { variantExpression: Expression }) => {
  const items: ConditionalDescriptionItem[] = [
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
  const items: ConditionalDescriptionItem[] = [
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

  const variantDescrptorItems: ConditionalDescriptionItem[] = [
    { key: 'id', label: 'interpretations.id', children: vd.id },
    {
      key: 'variation',
      label: 'interpretations.variation',
      children: <JsonView src={vd.variation as unknown as JSONType} />,
      isVisible: objectToBoolean(vd.variation),
    },
    { key: 'label', label: 'interpretations.label', children: vd.label },
    { key: 'description', label: 'interpretations.description', children: vd.description },
    {
      key: 'gene_context',
      label: 'interpretations.gene_context',
      children: <GeneDescriptor geneDescriptor={vd.gene_context!!} />,
      isVisible: vd?.gene_context,
    },
    {
      key: 'expressions',
      label: 'interpretations.expressions',
      children: (
        <Space direction="vertical" size="small">
          {vd.expressions!.map((e, i) => (
            <VariantExpressionDetails key={i} variantExpression={e} />
          ))}
        </Space>
      ),
      isVisible: vd?.expressions?.length,
    },
    {
      key: 'vcf_record',
      label: 'interpretations.vcf_record',
      children: <JsonView src={vd.vcf_record as unknown as JSONType} />,
      isVisible: objectToBoolean(vd.vcf_record),
    },
    {
      key: 'xrefs',
      label: 'interpretations.xrefs',
      children: vd.xrefs,
    },
    {
      key: 'alternate_labels',
      label: 'interpretations.alternate_labels',
      children: vd.alternate_labels,
    },
    {
      key: 'extensions',
      label: 'interpretations.extensions',
      children: <Table<Extension> columns={extentionTableColumns} dataSource={vd.extensions} />,
      isVisible: vd.extensions?.length,
    },
    {
      key: 'molecule_context',
      label: 'interpretations.molecule_context',
      children: vd.molecule_context,
    },
    {
      key: 'structural_type',
      label: 'interpretations.structural_type',
      children: <OntologyTerm term={vd.structural_type} />,
      isVisible: vd?.structural_type,
    },
    {
      key: 'vrs_ref_allele_seq',
      label: 'interpretations.vrs_ref_allele_seq',
      children: vd?.vrs_ref_allele_seq,
    },
    {
      key: 'allelic_state',
      label: 'interpretations.allelic_state',
      children: <OntologyTerm term={vd.allelic_state} />,
      isVisible: vd?.allelic_state,
    },
  ];

  return (
    <Space direction="vertical">
      <TDescriptions items={items} size="small" bordered />
      <TDescriptions items={variantDescrptorItems} size="small" bordered />
    </Space>
  );
};
