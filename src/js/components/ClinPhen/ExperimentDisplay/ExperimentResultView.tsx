import { useCallback, useMemo, useState } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import PhenopacketLink from '@/components/ClinPhen/PhenopacketLink';
import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import FileModal from '@Util/FileModal';
import TDescriptions from '@Util/TDescriptions';
import DownloadButton from '@Util/DownloadButton';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';
import UrlOrDrsUrlWithPopover from '@Util/UrlOrDrsUrlWithPopover';

import { useScopeDownloadData } from '@/hooks/censorship';
import { useTranslationFn } from '@/hooks';

import { objectToBoolean } from '@/utils/boolean';

import { VIEWABLE_FILE_EXTENSIONS } from 'bento-file-display';
import { VIEWABLE_FILE_FORMATS } from '@/constants/files';

export const ExperimentResultIndices = ({ indices }: { indices: ExperimentResult['indices'] }) => {
  return indices.length === 1 ? (
    <>
      <strong>{indices[0].format}:</strong> <UrlOrDrsUrlWithPopover url={indices[0].url} />
    </>
  ) : (
    <ul className="m-0" style={{ paddingLeft: 8 }}>
      {indices.map((i, idx) => (
        <li key={idx}>
          <strong>{i.format}:</strong> <UrlOrDrsUrlWithPopover url={i.url} />
        </li>
      ))}
    </ul>
  );
};

type ExperimentResultExpandedRowProps = {
  packetId?: string;
  currentExperiment?: string;
  experimentResult: ExperimentResult;
  searchRow?: boolean;
};

export const ExperimentResultExpandedRow = ({
  packetId,
  currentExperiment,
  experimentResult,
}: ExperimentResultExpandedRowProps) => {
  const items: ConditionalDescriptionItem[] = [
    {
      key: 'identifier',
      children: <span className="font-mono">{experimentResult.identifier}</span>,
      isVisible: !!experimentResult.identifier,
    },
    {
      key: 'description',
      label: 'general.description',
      children: experimentResult.description,
    },
    {
      key: 'url',
      label: 'general.url',
      children: <UrlOrDrsUrlWithPopover url={experimentResult.url} />,
      isVisible: !!experimentResult.url,
    },
    {
      key: 'indices',
      children: <ExperimentResultIndices indices={experimentResult.indices} />,
      isVisible: objectToBoolean(experimentResult.indices),
    },
    {
      key: 'genome_assembly_id',
      children: experimentResult.genome_assembly_id, // TODO: modal to reference genome details
    },
    {
      key: 'file_format',
      children: experimentResult.file_format,
    },
    { key: 'data_output_type', children: experimentResult.data_output_type },
    { key: 'usage', children: experimentResult.usage },
    { key: 'creation_date', children: experimentResult.creation_date },
    { key: 'created_by', children: experimentResult.created_by },
    // Not in the true Experiment Result schema, but can be added by the front end for linking purposes:
    {
      key: 'experiments',
      label: 'entities.experiment_other',
      // TODO: link to expanded row + scrollTo:
      children: (
        <PhenopacketLink.Experiments
          packetId={packetId}
          current={currentExperiment}
          experiments={experimentResult.experiments ?? []}
        />
      ),
      isVisible: objectToBoolean(experimentResult.experiments),
    },
  ];

  return (
    <Space className="experiment-result-expanded-row w-full" direction="vertical">
      <TDescriptions bordered size="compact" column={1} items={items} defaultI18nPrefix="experiment_result." />
      <ExtraPropertiesDisplay extraProperties={experimentResult.extra_properties} />
    </Space>
  );
};

export const isExperimentResultRowExpandable = (r: ExperimentResult) =>
  !!(
    r.identifier ||
    r.description ||
    r.filename ||
    r.url ||
    objectToBoolean(r.indices) ||
    r.genome_assembly_id ||
    r.file_format ||
    r.data_output_type ||
    r.usage ||
    r.creation_date ||
    r.created_by ||
    objectToBoolean(r.extra_properties)
  );

export type ExperimentResultActionsProps = {
  url?: string;
  filename?: string;
  fileFormat?: ExperimentResult['file_format'];
};

export const experimentResultViewable = ({ url, fileFormat, filename }: ExperimentResultActionsProps) =>
  !!url &&
  (VIEWABLE_FILE_FORMATS.includes(fileFormat ?? '') ||
    !!VIEWABLE_FILE_EXTENSIONS.find((ext) => (filename ?? '').toLowerCase().endsWith(ext)));

export const ExperimentResultActions = (props: ExperimentResultActionsProps) => {
  const t = useTranslationFn();
  const {
    hasAttempted: attemptedCanDownload,
    fetchingPermission: fetchingCanDownload,
    hasPermission: canDownload,
  } = useScopeDownloadData();

  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Slightly different from viewModalVisible - this is just set on the first click of the
  // view button and results in file loading being triggered. if FileDisplay was always
  // immediately shown, it would load all experiment results immediately, which is undesirable
  // behaviour. Instead, we wait until a user clicks it, then load the file, but we don't unmount
  // the component after, so we have the file contents cached.
  const [hasTriggeredViewModal, setHasTriggeredViewModal] = useState(false);

  const onViewClick = useCallback(() => {
    setHasTriggeredViewModal(true);
    setViewModalVisible(true);
  }, []);
  const onViewCancel = useCallback(() => setViewModalVisible(false), []);

  const resultViewable = experimentResultViewable(props);

  if (attemptedCanDownload && !canDownload) {
    return null;
  }

  const { url, filename } = props;

  return (
    <div className="experiment-result-actions" style={{ whiteSpace: 'nowrap' }}>
      {url ? (
        <>
          <Tooltip title={t('file.download')}>
            <DownloadButton size="small" url={url} fileName={filename} loading={fetchingCanDownload}>
              {''}
            </DownloadButton>
          </Tooltip>{' '}
        </>
      ) : null}
      {resultViewable ? (
        <>
          <FileModal
            open={viewModalVisible}
            onCancel={onViewCancel}
            title={
              <span>
                {t('general.view')}: {filename}
              </span>
            }
            url={url}
            fileName={filename}
            hasTriggered={hasTriggeredViewModal}
          />
          <Tooltip title={t('general.view')}>
            <Button size="small" icon={<EyeOutlined />} onClick={onViewClick} loading={fetchingCanDownload} />
          </Tooltip>{' '}
        </>
      ) : null}
    </div>
  );
};

type ExperimentResultViewProps = {
  packetId?: string;
  // Optional - if this is in the context of a single experiment, don't link the selected experiment:
  currentExperiment?: string;
  experimentResults: ExperimentResult[];
  urlAware?: boolean;
};

const ExperimentResultView = ({
  packetId,
  currentExperiment,
  experimentResults,
  urlAware,
}: ExperimentResultViewProps) => {
  const { hasAttempted: attemptedCanDownload, hasPermission: canDownload } = useScopeDownloadData();

  urlAware = urlAware ?? true;

  const columns = useMemo<CustomTableColumns<ExperimentResult>>(
    () => [
      // ID is a meaningless UUID that changes between ingests most of the time, don't bother showing it
      { title: 'experiment_result.filename', dataIndex: 'filename', alwaysShow: true },
      { title: 'general.description', dataIndex: 'description' },
      // TODO: nice render with modal to reference genome:
      { title: 'experiment_result.genome_assembly_id', dataIndex: 'genome_assembly_id' },
      { title: 'experiment_result.file_format', dataIndex: 'file_format' },
      {
        title: 'experiment_result.experiments',
        dataIndex: 'experiments',
        // Don't show experiments if we don't have any OR if the only experiment is the currently-selected one
        isEmpty: (es: string[] | undefined) =>
          !objectToBoolean(es) || (es?.length === 1 && es[0] === currentExperiment),
        render: (es: string[] | undefined) => (
          <PhenopacketLink.Experiments packetId={packetId} current={currentExperiment} experiments={es ?? []} />
        ),
      },
      {
        title: 'general.actions',
        key: 'actions',
        // Actions are present if we have a URL we can link to, and we have permission to download file data
        isEmpty: (_, er) => !er?.url || (attemptedCanDownload && !canDownload),
        render: (_, er) => <ExperimentResultActions url={er.url} filename={er.filename} fileFormat={er.file_format} />,
      },
    ],
    [attemptedCanDownload, canDownload, packetId, currentExperiment]
  );

  return (
    <CustomTable<ExperimentResult>
      dataSource={experimentResults}
      columns={columns}
      expandedRowRender={(record) => (
        <ExperimentResultExpandedRow
          packetId={packetId}
          currentExperiment={currentExperiment}
          experimentResult={record}
        />
      )}
      rowKey="id"
      queryKey="experimentResult"
      urlAware={urlAware}
      isRowExpandable={isExperimentResultRowExpandable}
    />
  );
};

export default ExperimentResultView;
