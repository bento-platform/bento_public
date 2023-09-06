export enum DataTypes {
    phenopacket = "phenopacket",
    experiment = "experiment",
    experiment_result = "experiment_result",
    variant = "variant",
    readset = "readset",
};

export const DataTypesLabels = {
    [DataTypes.phenopacket]: "Clinical Data",
    [DataTypes.experiment]: "Experiments",
    [DataTypes.experiment_result]: "Experiment Results",
    [DataTypes.variant]: "Variants",
    [DataTypes.readset]: "Readsets",
};

export const getDataTypeLabel = (dataTypeString: string): string => {
    const dataTypesValues = Object.values(DataTypes) as string[];
    if (dataTypesValues.includes(dataTypeString)) {
        const dataType: DataTypes = DataTypes[dataTypeString as keyof typeof DataTypes];
        return DataTypesLabels[dataType];
    }
    return "Unknown Data Type";
};
