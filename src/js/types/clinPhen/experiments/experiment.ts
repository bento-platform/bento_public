import type { OntologyTerm } from '@/types/ontology';
import type { ExtraPropertiesEntity } from '@/types/util';
import type { ExperimentResult } from './experimentResult';
import type { Instrument } from './instrument';

export interface Experiment extends ExtraPropertiesEntity {
  id: string;
  // conceptually, experiment_type and experiment_ontology refer to the same thing
  experiment_type:
    | 'DNA Methylation'
    | 'mRNA-Seq'
    | 'smRNA-Seq'
    | 'RNA-Seq'
    | 'miRNA-Seq'
    | 'scRNA-Seq'
    | 'snRNA-Seq'
    | 'WES'
    | 'WGS'
    | 'Genotyping'
    | 'Proteomic profiling'
    | 'Neutralizing antibody titers'
    | 'Metabolite profiling'
    | 'Antibody measurement'
    | 'Viral WGS'
    | 'DNA metabarcoding'
    | 'WGBS'
    | 'ChIP-Seq'
    | 'CUT&RUN'
    | 'CUT&Tag'
    | 'ATAC-Seq'
    | 'scATAC-Seq'
    | 'Hi-C'
    | 'scHiC-Seq'
    | 'Multiome'
    | 'Other';
  experiment_ontology?: OntologyTerm;
  description?: string;
  study_type?:
    | 'Genomics'
    | 'Epigenomics'
    | 'Metagenomics'
    | 'Transcriptomics'
    | 'Serology'
    | 'Metabolomics'
    | 'Proteomics'
    | '3D Genomics'
    | 'Multi-Omics'
    | 'Other';
  // conceptually, molecule and molecule_ontology refer to the same thing
  molecule?:
    | 'total RNA'
    | 'polyA RNA'
    | 'cytoplasmic RNA'
    | 'nuclear RNA'
    | 'small RNA'
    | 'genomic DNA'
    | 'protein'
    | 'chromatin'
    | 'Other';
  molecule_ontology?: OntologyTerm;
  library_id?: string;
  library_description?: string;
  library_strategy?: 'Bisulfite-Seq' | 'RNA-Seq' | 'ChIP-Seq' | 'WES' | 'WGS' | 'RAD-Seq' | 'AMPLICON' | 'ATAC-Seq' | 'Hi-C' | 'ddRAD-Seq' | 'GT-Seq' | 'GBS' | 'Other';
  library_source?:
    | 'Genomic'
    | 'Genomic Single Cell'
    | 'Transcriptomic'
    | 'Transcriptomic Single Cell'
    | 'Metagenomic'
    | 'Metatranscriptomic'
    | 'Synthetic'
    | 'Viral RNA'
    | 'Environmental DNA'
    | 'Environmental RNA'
    | 'Other';
  library_selection?: 'Random' | 'PCR' | 'Random PCR' | 'RT-PCR' | 'MF' | 'Exome capture' | 'ChIP' | 'PolyA' | 'Restriction Digest' | 'Other';
  library_layout?: 'Single' | 'Paired';
  library_extract_id?: string;
  insert_size?: number;
  protocol_url?: string;
  extraction_protocol?: string;
  reference_registry_id?: string;
  qc_flags?: string[];
  experiment_results?: ExperimentResult[];
  instrument?: Instrument;
  // Back-links
  biosample?: string;
  dataset?: string;
}
