import { Button } from 'antd';
import { EM_DASH } from '@/constants/common';
import { useMetadata } from '@/features/metadata/hooks';

export type DatasetTitleProps = {
  datasetID: string;
  onClick?: () => void;
};

const DatasetTitle = ({ datasetID, onClick }: DatasetTitleProps) => {
  const { datasetsByID } = useMetadata();

  if (!datasetID) return EM_DASH;

  const dataset = datasetsByID[datasetID];

  if (!dataset)
    return (
      <span aria-errormessage="dataset not available" aria-invalid="true">
        <span className="font-mono">{datasetID}</span> <span className="error-text">(NOT AVAILABLE)</span>
      </span>
    );

  const { title } = dataset;

  if (!onClick) return title;
  return (
    <Button type="link" className="p-0 h-auto" onClick={onClick}>
      {title}
    </Button>
  );
};

export default DatasetTitle;
