import { useCallback, useMemo, useState } from 'react';
import { Button, Popover, Space, Tooltip } from 'antd';
import { EyeOutlined, UnorderedListOutlined } from '@ant-design/icons';

import type { DrsAccessMethod } from '@/features/drs/types';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { ConditionalDescriptionItem } from '@/types/descriptions';

import CustomTable, { type CustomTableColumns } from '@Util/CustomTable';
import FileModal from '@Util/FileModal';
import TDescriptions from '@Util/TDescriptions';
import DownloadButton from '@Util/DownloadButton';
import ExtraPropertiesDisplay from '@Util/ClinPhen/ExtraPropertiesDisplay';

import { useScopeDownloadData } from '@/hooks/censorship';
import { useLocaleFileSize, useTranslationFn } from '@/hooks';
import { useDrsObjectOrPassThrough } from '@/features/drs/hooks';

import { VIEWABLE_FILE_EXTENSIONS } from 'bento-file-display';
import { VIEWABLE_FILE_FORMATS } from '@/constants/files';

const DRS_ACCESS_METHOD_LABELS: Record<DrsAccessMethod['type'], string> = {
  s3: 'S3',
  gs: 'GS',
  ftp: 'FTP',
  gsiftp: 'GSI-FTP',
  globus: 'Globus',
  htsget: 'htsget',
  https: 'HTTPS',
  file: 'File',
};

const UrlOrDrsUrlWithPopover = ({ url }: { url?: string }) => {
  const fileSize = useLocaleFileSize();
  const drsRec = useDrsObjectOrPassThrough(url);
  const { record } = drsRec ?? { record: null };

  return record ? (
    <Popover
      trigger="click"
      content={
        <TDescriptions
          defaultI18nPrefix="drs."
          bordered={true}
          column={1}
          size="compact"
          style={{ maxWidth: 'min(90vw, 800px)' }}
          items={[
            { key: 'id', children: <code>{record.id}</code> },
            { key: 'name', children: <span>{record.name}</span>, isVisible: !!record.name },
            { key: 'description', children: <span>{record.description}</span>, isVisible: !!record.description },
            { key: 'self_uri', children: <span>{record.self_uri}</span>, isVisible: !!record.self_uri },
            {
              key: 'aliases',
              children: <span>{(record.aliases ?? []).join(', ')}</span>,
              isVisible: !!(record.aliases ?? []).length,
            },
            {
              key: 'size',
              children: <span>{fileSize(record.size)}</span>,
            },
            {
              key: 'created_time',
              children: <span>{record.created_time}</span>,
            },
            {
              key: 'updated_time',
              children: <span>{record.updated_time}</span>,
              isVisible: !!record.updated_time,
            },
            {
              key: 'version',
              children: <span>{record.version}</span>,
              isVisible: !!record.version,
            },
            {
              key: 'mime_type',
              children: <span>{record.mime_type}</span>,
              isVisible: !!record.mime_type,
            },
            {
              key: 'checksums',
              children: (
                <ul className="m-0 p-0 list-none">
                  {record.checksums.map((chk) => (
                    <li key={chk.type}>
                      <strong>{chk.type.toLocaleUpperCase()}:</strong>{' '}
                      <code style={{ fontSize: 12 }}>{chk.checksum}</code>
                    </li>
                  ))}
                </ul>
              ),
              isVisible: !!record.checksums.length,
            },
            {
              key: 'access_methods',
              children: (
                <ul className="m-0 p-0 list-none">
                  {(record.access_methods ?? []).map((am, idx) => (
                    <li key={idx}>
                      <strong>{DRS_ACCESS_METHOD_LABELS[am.type] ?? am.type}:</strong>{' '}
                      <span style={{ fontSize: 12 }}>{am.access_url?.url ?? am.access_id}</span>
                    </li>
                  ))}
                </ul>
              ),
              isVisible: !!(record.access_methods ?? []).length,
            },
          ]}
        />
      }
    >
      <span className="cursor-pointer underline">{url}</span> <Button size="small" icon={<UnorderedListOutlined />} />
    </Popover>
  ) : (
    url
  );
};

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

export const ExperimentResultExpandedRow = ({
  experimentResult,
}: {
  experimentResult: ExperimentResult;
  searchRow?: boolean;
}) => {
  const items: ConditionalDescriptionItem[] = [
    { key: 'identifier', children: <code>{experimentResult.identifier}</code> },
    // {
    //   key: 'description',
    //   label: 'general.description',
    //   children: experimentResult.description,
    // },
    {
      key: 'url',
      label: 'general.url',
      children: <UrlOrDrsUrlWithPopover url={experimentResult.url} />,
      isVisible: !!experimentResult.url,
    },
    {
      key: 'indices',
      children: <ExperimentResultIndices indices={experimentResult.indices} />,
      isVisible: !!(experimentResult.indices ?? []).length,
    },
    // {
    //   key: 'genome_assembly_id',
    //   children: experimentResult.genome_assembly_id, // TODO: modal to reference genome details
    // },
    // {
    //   key: 'file_format',
    //   children: experimentResult.file_format,
    // },
    { key: 'data_output_type', children: experimentResult.data_output_type },
    { key: 'usage', children: experimentResult.usage },
    { key: 'creation_date', children: experimentResult.creation_date },
    { key: 'created_by', children: experimentResult.created_by },
    // Not in the true Experiment Result schema, but can be added by the front end for linking purposes:
    {
      key: 'experiment_id',
      label: 'entities.experiment_one',
      children: experimentResult.experiment_id, // TODO: link to expanded row + scrollTo
    },
  ];

  return (
    <Space direction="vertical" className="w-full">
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
    (r.indices ?? []).length ||
    r.genome_assembly_id ||
    r.file_format ||
    r.data_output_type ||
    r.usage ||
    r.creation_date ||
    r.created_by ||
    Object.keys(r.extra_properties ?? {}).length
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
  const { hasAttempted: attemptedCanDownload, hasPermission: canDownload } = useScopeDownloadData();

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
            <DownloadButton size="small" url={url} fileName={filename}>
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
          <Tooltip title="View">
            <Button size="small" icon={<EyeOutlined />} onClick={onViewClick} />
          </Tooltip>{' '}
        </>
      ) : null}
    </div>
  );
};

type ExperimentResultViewProps = {
  experimentResults: ExperimentResult[];
  urlAware?: boolean;
};

const ExperimentResultView = ({ experimentResults, urlAware }: ExperimentResultViewProps) => {
  const { hasAttempted: attemptedCanDownload, hasPermission: canDownload } = useScopeDownloadData();

  urlAware = urlAware ?? true;

  const columns = useMemo<CustomTableColumns<ExperimentResult>>(
    () => [
      // ID is a meaningless UUID that changes between ingests most of the time, don't bother showing it
      { title: 'experiment_result.filename', dataIndex: 'filename', alwaysShow: true },
      { title: 'general.description', dataIndex: 'description' },
      {
        title: 'experiment_result.genome_assembly_id',
        dataIndex: 'genome_assembly_id', // TODO: nice render with modal to reference genome
      },
      { title: 'experiment_result.file_format', dataIndex: 'file_format' },
      {
        title: 'general.actions',
        key: 'actions',
        // Actions are present if we have a URL we can link to, and we have permission to download file data
        isEmpty: (_, er) => !er?.url || (attemptedCanDownload && !canDownload),
        render: (_, er) => <ExperimentResultActions url={er.url} filename={er.filename} fileFormat={er.file_format} />,
      },
    ],
    [attemptedCanDownload, canDownload]
  );

  return (
    <CustomTable<ExperimentResult>
      dataSource={experimentResults}
      columns={columns}
      expandedRowRender={(record) => <ExperimentResultExpandedRow experimentResult={record} />}
      rowKey="identifier"
      queryKey="experimentResult"
      urlAware={urlAware}
      isRowExpandable={isExperimentResultRowExpandable}
    />
  );
};

export default ExperimentResultView;
