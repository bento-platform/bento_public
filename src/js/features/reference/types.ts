import type { OntologyTerm } from '@/types/clinphen/ontology';

// See also: https://github.com/bento-platform/bento_reference_service/blob/main/bento_reference_service/models.py

export type Contig = {
  name: string;
  aliases: string[];
  md5: string;
  ga4gh: string;
  length: number;
  circular: boolean;
  refget_uris: string[];
};

export type Genome = {
  id: string;
  aliases: string[];
  md5: string;
  ga4gh: string;
  fasta: string;
  fai: string;
  gff3_gz: string;
  gff3_gz_tbi: string;
  taxon: OntologyTerm;
  contigs: Contig[];
  uri: string;
};

export type GenomeFeature = {
  genome_id: string;
  contig_name: string;

  strand: '-' | '+' | '?' | '.';

  feature_id: string;
  feature_name: string;
  feature_type: string;

  source: string;
  entries: { start_pos: number; end_pos: number; score: number | null; phase: number | null }[];
};
