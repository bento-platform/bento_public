import { Button } from 'antd';

import { EM_DASH } from '@/constants/common';
import ErrorText from './ErrorText';
import MonospaceText from './MonospaceText';

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
      <span>
        <MonospaceText>{datasetID}</MonospaceText> <ErrorText>(NOT AVAILABLE)</ErrorText>
      </span>
    );

  const { title } = dataset;

  if (!onClick) return title;
  return (
    <Button type="link" style={{ height: 'auto', padding: 0 }} onClick={onClick}>
      {title}
    </Button>
  );
};

export default DatasetTitle;
