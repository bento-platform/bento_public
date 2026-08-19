import { List } from 'antd';
import { useTranslationFn } from '@/hooks';

const StringList = ({ list }: { list: string[] | undefined }) => {
  const t = useTranslationFn();
  return <List bordered dataSource={list} renderItem={(item) => <List.Item>{t(item)}</List.Item>} />;
};

export default StringList;
