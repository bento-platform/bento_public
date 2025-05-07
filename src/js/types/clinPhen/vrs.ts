/**
 * Types for Variation Representation Specification (VRS).
 */

// This is a simplified representation. A full VRS implementation would be quite complex.
//  We are only including the specific types used in the phenopacket
export interface Expression {
  syntax: string;
  value: string;
  version?: string;
}

export interface VcfRecord {
  genome_assembly: string;
  chrom: string;
  pos: number;
  id: string;
  ref: string;
  alt: string;
  qual?: string;
  filter?: string;
  info?: string;
}

export interface Variation {
  type: string;
}

export interface Allele extends Variation {
  location: string;
  state: string;
}

export interface AbsoluteCopyNumber extends Variation {
  subject: string;
  copies: string;
}
