import { Typography } from 'antd';
const { Link, Text } = Typography;
import { LinkOutlined } from '@ant-design/icons/lib';

export enum ExcludedModel {
  PHENOTYPE = 'phenotype',
  DISEASE = 'disease',
}

const Excluded = ({ model }: { model: ExcludedModel }) => {
  return (
    <Text type="danger">
      &nbsp; (
      <Text type="danger" strong>
        Excluded:
      </Text>
      &nbsp; Found to be absent &nbsp;
      <Link href={`https://phenopacket-schema.readthedocs.io/en/2.0.0/${model}.html#excluded`}>
        <LinkOutlined />
      </Link>
      )
    </Text>
  );
};

export default Excluded;
