/**
 * Represents a variation descriptor.
 */
import type { GeneDescriptor } from './gene_descriptor';
import type { Extension, OntologyTerm } from './shared';
import type { AbsoluteCopyNumber, Allele, Expression, VcfRecord } from './vrs';
import type { TimestampedEntity } from '@/types/util';

export interface VariationDescriptor extends TimestampedEntity {
  id: string;
  variation?: Allele | AbsoluteCopyNumber;
  label?: string;
  description?: string;
  gene_context?: GeneDescriptor;
  expressions?: Expression[];
  vcf_record?: VcfRecord;
  xrefs?: string[];
  alternate_labels?: string[];
  extensions?: Extension[];
  molecule_context?: string;
  structural_type?: OntologyTerm;
  vrs_ref_allele_seq?: string;
  allelic_state?: OntologyTerm;
}
