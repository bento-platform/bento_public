export type BentoEntity = 'phenopacket' | 'individual' | 'biosample' | 'experiment' | 'experiment_result' | 'variant';
export type BentoKatsuEntity = Exclude<BentoEntity, 'variant'>;
export type BentoCountEntity = Exclude<BentoKatsuEntity, 'phenopacket'>;
export type ResultsDataEntity = Exclude<BentoKatsuEntity, 'individual'>;

// If boolean, it means we have data above the threshold but don't have permissions to view the exact count.
export type KatsuEntityCountsOrBooleans = Record<BentoKatsuEntity, number | boolean>;
export type BentoCountEntityCountsOrBooleans = Record<BentoCountEntity, number | boolean>;
