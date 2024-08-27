import React, { useState } from 'react';
import { Button, Card, Col, Row, Skeleton, Space, Statistic, Tag, Tooltip, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import ExpSvg from '../../Util/ExpSvg';
import { BOX_SHADOW, COUNTS_FILL } from '@/constants/overviewConstants';
import SearchResultsPane from '../../Search/SearchResultsPane';
import BeaconOrganization from './BeaconOrganization';
import { NetworkBeacon } from '@/types/beaconNetwork';

import { useTranslationDefault } from '@/hooks';
import { FlattenedBeaconResponse } from '@/types/beacon';
const { Title } = Typography;

const CARD_DEFAULT_WIDTH = '390px';
const CARD_FULL_DETAILS_WIDTH = '1200px';

const CustomSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* <Skeleton title={false} paragraph={{rows: 2, width: 300}} active /> */}
      <Skeleton.Input size="small" style={{ width: '350px' }} active />
      <Skeleton.Input size="small" style={{ marginTop: '10px', width: '350px' }} active />
    </div>
  );
};

const BeaconDetails = ({ beacon, response }: BeaconDetailsProps) => {
  console.log({ beacon });

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

  console.log('BeaconDetails()');

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
        maxWidth: showFullCard ? CARD_FULL_DETAILS_WIDTH : CARD_DEFAULT_WIDTH,
        width: '100%',
        minHeight: '328px', // leave enough room for stats skeleton
        ...BOX_SHADOW,
      }}
      styles={{ body: {} }}
      extra={
        <>
          {hasApiError && (
            <Tooltip title={`Error response from beacon: ${apiErrorMessage}`}>
              <Tag color="red">error</Tag>
            </Tooltip>
          )}
          <Button onClick={toggleFullCard}>more</Button>
        </>
      }
    >
      <Row gutter={[8, 8]}>
        <Col span={6}>
          <img
            src={organization.logoUrl}
            style={{ maxWidth: '175px', maxHeight: '100px', width: 'auto', height: 'auto', paddingBottom: "10px" }}
          />
          <div>
          {assemblies.map((a) => (
            <Tag color="blue" key={a}>
              {a}
            </Tag>
          ))}
          </div>
        </Col>
        <Col span={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space direction="vertical" size="middle" style={{ display: 'flex', alignItems: 'flex-start' }}>
            {isFetchingQueryResponse ? (
              <CustomSkeleton />
            ) : (
              <>
                <Statistic
                  style={{ minWidth: '100px' }}
                  title={t('Individuals')}
                  value={individualCount ? individualCount : '----'}
                  valueStyle={{ color: COUNTS_FILL }}
                  prefix={<TeamOutlined />}
                />
                <Statistic
                  style={{ minWidth: '100px' }}
                  title={t('Biosamples')}
                  value={biosampleCount ? biosampleCount : '----'}
                  valueStyle={{ color: COUNTS_FILL }}
                  prefix={<BiDna />}
                />
                <Statistic
                  style={{ minWidth: '100px' }}
                  title={t('Experiments')}
                  value={experimentCount ? experimentCount : '----'}
                  valueStyle={{ color: COUNTS_FILL }}
                  prefix={<ExpSvg />}
                />
              </>
            )}
          </Space>
        </Col>
      </Row>
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
    </Card>
  );
};

export interface BeaconDetailsProps {
  beacon: NetworkBeacon;
  response: FlattenedBeaconResponse;
}

export default BeaconDetails;
