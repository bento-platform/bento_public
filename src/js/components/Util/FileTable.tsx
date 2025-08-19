import { Button, Table } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import ExtraProperties from './ExtraProperties';
import { EM_DASH } from '@/constants/common';

import type { File } from '@/types/clinPhen/file';

import { useTranslatedTableColumnTitles } from '@/hooks/useTranslatedTableColumnTitles';

const FileTable = ({ files }: { files: File[] }) => {
  const columns = useTranslatedTableColumnTitles<File>([
    {
      title: 'file.download',
      dataIndex: 'uri',
      render: (uri: string) => (
        <a href={uri} target="_blank" rel="noreferrer">
          <Button icon={<DownloadOutlined />} />
        </a>
      ),
    },
    {
      title: 'file.individual_to_file_identifiers',
      dataIndex: 'individual_to_file_identifiers',
      render: (d: File['individual_to_file_identifiers']) => (d ? <ExtraProperties extraProperties={d} /> : EM_DASH),
    },
    {
      title: 'file.file_attributes',
      dataIndex: 'file_attributes',
      render: (d: File['file_attributes']) => (d ? <ExtraProperties extraProperties={d} /> : EM_DASH),
    },
  ]);
  return <Table<File> columns={columns} dataSource={files} />;
};

export default FileTable;
