import { Typography } from 'antd';
const { Link, Text } = Typography;
import { LinkOutlined } from '@ant-design/icons/lib';

import { useTranslationFn } from '@/hooks';

export enum ExcludedModel {
  PHENOTYPE = 'phenotype',
  DISEASE = 'disease',
}

const Excluded = ({ model }: { model: ExcludedModel }) => {
  const t = useTranslationFn();
  return (
    <Text type="danger">
      &nbsp; (
      <Text type="danger" strong>
        {t('clinphen_generic.excluded')}:
      </Text>
      &nbsp; {t('clinphen_generic.found_absent')} &nbsp;
      <Link
        href={`https://phenopacket-schema.readthedocs.io/en/2.0.0/${model}.html#excluded`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkOutlined />
      </Link>
      )
    </Text>
  );
};

export default Excluded;
