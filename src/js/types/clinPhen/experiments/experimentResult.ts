import type { ExtraPropertiesEntity } from '@/types/util';

export interface ExperimentResultIndex {
  url: string;
  format: 'BAI' | 'BGZF' | 'CRAI' | 'CSI' | 'TABIX' | 'TRIBBLE';
}

export interface ExperimentResult extends ExtraPropertiesEntity {
  identifier: string;
  description: string;
  filename: string;
  url: string;
  indices: ExperimentResultIndex[];
  genome_assembly_id: string;
  file_format:
    | 'SAM'
    | 'BAM'
    | 'CRAM'
    | 'VCF'
    | 'BCF'
    | 'MAF'
    | 'GVCF'
    | 'BigWig'
    | 'BigBed'
    | 'FASTA'
    | 'FASTQ'
    | 'TAB'
    | 'SRA'
    | 'SRF'
    | 'SFF'
    | 'GFF'
    | 'PDF'
    | 'CSV'
    | 'TSV'
    | 'JPEG'
    | 'PNG'
    | 'GIF'
    | 'HTML'
    | 'MARKDOWN'
    | 'MP3'
    | 'M4A'
    | 'MP4'
    | 'DOCX'
    | 'XLS'
    | 'XLSX'
    | 'UNKNOWN'
    | 'OTHER';
  data_output_type?: 'Raw data' | 'Derived data';
  usage?: string;
  creation_date?: string;
  created_by?: string;
}
