import { Switch, Table } from 'antd';
import type { ExperimentResultWithView } from '@/utils/igv';

const TrackControlTable = ({
  toggleView,
  experimentResults,
}: {
  toggleView: (track: ExperimentResultWithView) => void;
  experimentResults: ExperimentResultWithView[];
}) => {
  const trackTableColumns = [
    {
      title: 'File',
      dataIndex: 'filename',
    },
    {
      title: 'Format',
      dataIndex: 'file_format',
    },
    {
      title: 'Assembly ID',
      dataIndex: 'genome_assembly_id',
    },
    {
      title: 'View track',
      key: 'view',
      align: 'center' as const,
      render: (_: unknown, track: ExperimentResultWithView) => (
        <Switch checked={track.viewInIgv} onChange={() => toggleView(track)} />
      ),
    },
  ];
  return (
    <Table
      bordered
      size="small"
      pagination={false}
      columns={trackTableColumns}
      rowKey="filename"
      dataSource={experimentResults}
    />
  );
};

export default TrackControlTable;
