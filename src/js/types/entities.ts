export type BentoEntity = 'phenopacket' | 'individual' | 'biosample' | 'experiment' | 'experiment_result' | 'variant';
export type BentoCountEntity = Exclude<BentoEntity, 'phenopacket' | 'variant'>;
export type ResultsDataEntity = Exclude<BentoEntity, 'individual' | 'variant'>;
