import React, { useState } from 'react';
import { Button, Card, Col, Flex, Row, Skeleton, Space, Statistic, Tag, Tooltip, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import ExpSvg from '../../Util/ExpSvg';
import { BOX_SHADOW, COUNTS_FILL } from '@/constants/overviewConstants';
import SearchResultsPane from '../../Search/SearchResultsPane';
import BeaconOrganization from './BeaconOrganization';
import { NetworkBeacon } from '@/types/beaconNetwork';
import CustomStatistic from './CustomStatistic';

import { useTranslationDefault } from '@/hooks';
import { FlattenedBeaconResponse } from '@/types/beacon';
import Meta from 'antd/es/card/Meta';
const { Title, Text } = Typography;

const BEACON_DETAILS_WIDTH = 380;
const BEACON_DETAILS_HEIGHT = 250;

const CustomSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* <Skeleton title={false} paragraph={{ rows: 2, width: 110 }} active /> */}
      <Skeleton.Input size="small" style={{ width: '100px' }} active />
      <Skeleton.Input size="small" style={{ marginTop: '10px', width: '110px' }} active />
    </div>
  );
};

const BeaconDetailsSmall = ({ beacon, response }: BeaconDetailsSmallProps) => {
  const t = useTranslationDefault();
  const { apiUrl, organization, description, overview } = beacon;
  const { variants } = overview;
  const assemblies = Object.keys(variants);

  const bentoUrl = apiUrl.replace('/api/beacon', '');

  const {
    isFetchingQueryResponse,
    hasApiError,
    apiErrorMessage,
    individualCount,
    biosampleCount,
    experimentCount,
    biosampleChartData,
    experimentChartData,
  } = response;
  const [showFullCard, setShowFullCard] = useState<boolean>(false);

  // some fields may be missing from response, eg when there's an error
  const individualCountValue = individualCount ?? 0;
  const biosampleCountValue = biosampleCount ?? 0;
  const biosampleChartDataValue = biosampleChartData ?? [];
  const experimentCountValue = experimentCount ?? 0;
  const experimentChartDataValue = experimentChartData ?? [];

  const toggleFullCard = () => {
    setShowFullCard(!showFullCard);
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={5} type="secondary">
            {organization.name}
          </Title>
        </div>
      }
      style={{
        margin: '5px',
        borderRadius: '10px',
        padding: '5px',
        width: showFullCard ? '1200px' : `${BEACON_DETAILS_WIDTH}px`,
        // width: '100%',
        minHeight: `${BEACON_DETAILS_HEIGHT}px`,
        ...BOX_SHADOW,
      }}
      styles={{ title: { whiteSpace: 'unset' }, body: { display: 'flex', flexDirection: 'column', height: '100%' } }}
      extra={
        <>
          {hasApiError && (
            <Tooltip title={`Error response from beacon: ${apiErrorMessage}`}>
              <Tag color="red">error</Tag>
            </Tooltip>
          )}
          <Button onClick={toggleFullCard}>{showFullCard ? 'less' : 'more'}</Button>
        </>
      }
    >
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ padding: '10px' }}>
            <img
              src={organization.logoUrl}
              style={{ maxWidth: '125px', maxHeight: '80px', width: 'auto', height: 'auto' }}
            />
          </div>
          {isFetchingQueryResponse ? (
            <CustomSkeleton />
          ) : (
            <Statistic
              style={{ minWidth: '100px' }}
              //   title={t('Individuals')}
              value={individualCount ? individualCount : '----'}
              valueStyle={{ color: COUNTS_FILL }}
              prefix={<TeamOutlined />}
            />
          )}
        </div>
      </div>
      {showFullCard && (
        <Row>
          <BeaconOrganization organization={organization} bentoUrl={bentoUrl} description={description} />
          <SearchResultsPane
            isFetchingData={false}
            hasInsufficientData={false}
            message={''}
            individualCount={individualCountValue}
            biosampleCount={biosampleCountValue}
            biosampleChartData={biosampleChartDataValue}
            experimentCount={experimentCountValue}
            experimentChartData={experimentChartDataValue}
          />
        </Row>
      )}
      <Card.Meta
        title={
          <div style={{ display: 'flex', position: 'absolute', left: '20px', bottom: '20px' }}>
            {assemblies.map((a) => (
              <Tag color="blue" key={a}>
                {a}
              </Tag>
            ))}
          </div>
        }
      />
    </Card>
  );
};

export interface BeaconDetailsSmallProps {
  beacon: NetworkBeacon;
  response: FlattenedBeaconResponse;
}

export default BeaconDetailsSmall;
