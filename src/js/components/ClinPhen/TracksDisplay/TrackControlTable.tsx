import { Switch, Table } from 'antd';
import type { ExperimentResultWithView } from '@/types/clinPhen/igv';

const TrackControlTable = ({
  toggleView,
  tracks,
}: {
  toggleView: (track: ExperimentResultWithView) => void;
  tracks: ExperimentResultWithView[];
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
    <Table bordered size="small" pagination={false} columns={trackTableColumns} rowKey="filename" dataSource={tracks} />
  );
};

export default TrackControlTable;
