export type BentoEntity = 'phenopacket' | 'individual' | 'biosample' | 'experiment' | 'experiment_result' | 'variant';
export type BentoKatsuEntity = Exclude<BentoEntity, 'variant'>;
export type BentoCountEntity = Exclude<BentoKatsuEntity, 'phenopacket'>;
export type ResultsDataEntity = Exclude<BentoKatsuEntity, 'individual'>;
