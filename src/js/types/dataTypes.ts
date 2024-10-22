export enum DataTypes {
  phenopacket = 'phenopacket',
  experiment = 'experiment',
  experiment_result = 'experiment_result',
  variant = 'variant',
}

export const DataTypesLabels = {
  [DataTypes.phenopacket]: 'entities.Phenopackets',
  [DataTypes.experiment]: 'entities.Experiments',
  [DataTypes.experiment_result]: 'entities.Experiment Results',
  [DataTypes.variant]: 'entities.Variants',
};

export const getDataTypeLabel = (dataTypeString: string): string => {
  const dataTypesValues = Object.values(DataTypes) as string[];
  if (dataTypesValues.includes(dataTypeString)) {
    const dataType: DataTypes = DataTypes[dataTypeString as keyof typeof DataTypes];
    return DataTypesLabels[dataType];
  }
  return 'Unknown Data Type';
};
