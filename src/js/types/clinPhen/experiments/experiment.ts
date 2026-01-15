import type { OntologyTerm } from '@/types/ontology';
import type { ExtraPropertiesEntity } from '@/types/util';
import type { ExperimentResult } from './experimentResult';
import type { Instrument } from './instrument';

export interface Experiment extends ExtraPropertiesEntity {
  id: string;
  experiment_type:
    | 'DNA Methylation'
    | 'mRNA-Seq'
    | 'smRNA-Seq'
    | 'RNA-Seq'
    | 'WES'
    | 'WGS'
    | 'Genotyping'
    | 'Proteomic profiling'
    | 'Neutralizing antibody titers'
    | 'Metabolite profiling'
    | 'Antibody measurement'
    | 'Viral WGS'
    | 'Other';
  experiment_ontology?: OntologyTerm;
  study_type?:
    | 'Genomics'
    | 'Epigenomics'
    | 'Metagenomics'
    | 'Transcriptomics'
    | 'Serology'
    | 'Metabolomics'
    | 'Proteomics'
    | 'Other';
  molecule?:
    | 'total RNA'
    | 'polyA RNA'
    | 'cytoplasmic RNA'
    | 'nuclear RNA'
    | 'small RNA'
    | 'genomic DNA'
    | 'protein'
    | 'Other';
  molecule_ontology?: OntologyTerm;
  library_strategy?: 'Bisulfite-Seq' | 'RNA-Seq' | 'ChIP-Seq' | 'WES' | 'WGS' | 'RAD-Seq' | 'AMPLICON' | 'Other';
  library_source?:
    | 'Genomic'
    | 'Genomic Single Cell'
    | 'Transcriptomic'
    | 'Transcriptomic Single Cell'
    | 'Metagenomic'
    | 'Metatranscriptomic'
    | 'Synthetic'
    | 'Viral RNA'
    | 'Other';
  library_selection?: 'Random' | 'PCR' | 'Random PCR' | 'RT-PCR' | 'MF' | 'Exome capture' | 'Other';
  library_layout?: 'Single' | 'Paired';
  library_id?: string;
  library_extract_id?: string;
  insert_size?: number;
  description?: string;
  library_description?: string;
  protocol_url?: string;
  ga4gh_template_id?: string;
  extraction_protocol?: string;
  reference_registry_id?: string;
  qc_flags?: string[];
  experiment_results?: ExperimentResult[];
  instrument?: Instrument;
}
