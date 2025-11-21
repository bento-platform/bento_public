import type { DrsAccessMethod } from '@/features/drs/types';

import { useLocaleFileSize } from '@/hooks';
import { useDrsObjectOrPassThrough } from '@/features/drs/hooks';

import { Button, Popover } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import TDescriptions from '@Util/TDescriptions';

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

export default UrlOrDrsUrlWithPopover;
