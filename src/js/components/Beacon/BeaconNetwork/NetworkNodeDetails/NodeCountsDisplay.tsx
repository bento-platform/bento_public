import { Skeleton, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import ExpSvg from '@/components/Util/ExpSvg';
import { useTranslationDefault } from '@/hooks';
import type { FlattenedBeaconResponse } from '@/types/beacon';
import { COUNTS_FILL } from '@/constants/overviewConstants';
import { NO_RESULTS_DASHES } from '@/constants/searchConstants';

const NodeCountsDisplay = ({
  isFetchingQueryResponse,
  individualCount,
  biosampleCount,
  experimentCount,
}: NodeCountsDisplayProps) => {
  const t = useTranslationDefault();

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Space direction="horizontal" size="middle" style={{ display: 'flex', alignItems: 'flex-start' }}>
        {isFetchingQueryResponse ? (
          <div style={{ display: 'flex', flexDirection: 'column', margin: '6px 0' }}>
            <Skeleton.Input size="small" style={{ width: '330px', height: '20px' }} active />
            <Skeleton.Input size="small" style={{ marginTop: '10px', width: '330px', height: '20px' }} active />
          </div>
        ) : (
          <>
            <Statistic
              style={{ minWidth: '100px' }}
              title={t('Individuals')}
              value={individualCount ? individualCount : NO_RESULTS_DASHES}
              valueStyle={{ color: COUNTS_FILL }}
              prefix={<TeamOutlined />}
            />
            <Statistic
              style={{ minWidth: '100px' }}
              title={t('Biosamples')}
              value={biosampleCount ? biosampleCount : NO_RESULTS_DASHES}
              valueStyle={{ color: COUNTS_FILL }}
              prefix={<BiDna />}
            />
            <Statistic
              style={{ minWidth: '100px' }}
              title={t('Experiments')}
              value={experimentCount ? experimentCount : NO_RESULTS_DASHES}
              valueStyle={{ color: COUNTS_FILL }}
              prefix={<ExpSvg />}
            />
          </>
        )}
      </Space>
    </div>
  );
};

export interface NodeCountsDisplayProps {
  isFetchingQueryResponse: FlattenedBeaconResponse['isFetchingQueryResponse'];
  individualCount: FlattenedBeaconResponse['individualCount'];
  biosampleCount: FlattenedBeaconResponse['biosampleCount'];
  experimentCount: FlattenedBeaconResponse['experimentCount'];
}

export default NodeCountsDisplay;
