import { Empty } from 'antd';
import { useTranslationFn } from '@/hooks';

const CustomEmpty = ({ text }) => {
  const t = useTranslationFn();

  return <Empty description={t(text)} />;
};

export default CustomEmpty;
