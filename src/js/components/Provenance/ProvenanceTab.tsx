import { Row } from 'antd';
import DatasetProvenance from './DatasetProvenance';
import { useAppSelector } from '@/hooks';

const ProvenanceTab = () => {
  const { data, isFetching: loading } = useAppSelector((state) => state.provenance);

  return (
    <Row justify="center">
      {data.map((dataset, i) => (
        <DatasetProvenance key={i} metadata={dataset} loading={loading} />
      ))}
    </Row>
  );
};

export default ProvenanceTab;
