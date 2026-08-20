import { Switch, Table } from 'antd';
import type { ExperimentResultWithView } from '@/types/clinPhen/igv';
import { useTranslationFn } from '@/hooks';

const TrackControlTable = ({
  toggleView,
  tracks,
}: {
  toggleView: (track: ExperimentResultWithView) => void;
  tracks: ExperimentResultWithView[];
}) => {
  const t = useTranslationFn();
  const trackTableColumns = [
    {
      title: t('entities.experiment_result_one'),
      dataIndex: 'filename',
    },
    {
      title: t('experiment_result.description'),
      dataIndex: 'description',
    },
    {
      title: t('experiment_result.file_format'),
      dataIndex: 'file_format',
    },
    {
      title: t('experiment_result.genome_assembly_id'),
      dataIndex: 'genome_assembly_id',
    },
    {
      title: t('general.view'),
      key: 'view',
      align: 'center' as const,
      render: (_: unknown, track: ExperimentResultWithView) => (
        <Switch checked={track.viewInIgv} onChange={() => toggleView(track)} />
      ),
    },
  ];

  return <Table bordered pagination={false} columns={trackTableColumns} rowKey="filename" dataSource={tracks} />;
};

export default TrackControlTable;
