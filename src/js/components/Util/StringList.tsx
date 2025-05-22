import { List } from 'antd';

const StringList = ({ list }: { list: string[] | undefined }) => {
  return <List bordered dataSource={list} renderItem={(item) => <List.Item>{item}</List.Item>} />;
};

export default StringList;
