import { Empty } from 'antd';
import { useTranslationDefault } from '@/hooks';

const CustomEmpty = ({ text }) => {
  const td = useTranslationDefault();

  return <Empty description={td(text)} />;
};

export default CustomEmpty;
