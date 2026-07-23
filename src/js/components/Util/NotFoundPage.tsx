import { Empty } from 'antd';
import { useTranslationFn } from '@/hooks';

const NotFoundPage = () => {
  const t = useTranslationFn();
  return <Empty description={t('errors.page_not_found')} style={{ marginTop: 48 }} />;
};

export default NotFoundPage;
