import React, { useState } from 'react';
import { useAppSelector } from '@/hooks';
import { Button, Card, Col, Row, Space, Statistic, Tag, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import ExpSvg from '../Util/ExpSvg';
import { BOX_SHADOW, COUNTS_FILL } from '@/constants/overviewConstants';
import SearchResultsPane from '../Search/SearchResultsPane';
import BeaconOrganization from './BeaconOrganization';
import { NetworkBeacon, BeaconFlattenedAggregateResponse } from '@/types/beaconNetwork';

import { useTranslationDefault } from '@/hooks';
import { FlattenedBeaconResponse } from '@/types/beacon';
const { Title } = Typography;
const { Meta } = Card;
// get name, logo, and overview details from /overview for each instance

//get results for each beacon from redux and pass as props

// add a tag for each assembly

// link for bento_public beacon for an instance is at top-level "welcomeUrl"
// this ONLY exists for instances with a beacon UI
// there is no general "bento_public" link for instances
// note that the top-level "welcomeUrl" is separate from organization.welcomeUrl

const BeaconDetails = ({ beacon, response }: BeaconDetailsProps) => {
  console.log({ beacon });

  const t = useTranslationDefault();
  const { id, organization, welcomeUrl, description, overview } = beacon;
  const { variants } = overview;
  const assemblies = Object.keys(variants);

  console.log({ assemblies });

  const { individualCount, biosampleCount, experimentCount, biosampleChartData, experimentChartData } = response;
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
        <div style={{ display: 'flex' }}>
          <Title level={5} type="secondary">
            {organization.name}
          </Title>
        </div>
      }
      style={{
        margin: '5px',
        borderRadius: '10px',
        padding: '5px',
        maxWidth: showFullCard ? '1200px' : '680px',
        width: '100%',
        ...BOX_SHADOW,
      }}
      styles={{body: {paddingBottom: "10px"}}}
      extra={<Button onClick={toggleFullCard}>more</Button>}
    >
      <Row gutter={[8, 8]}>
        <Col span={6}>
          <img
            src={organization.logoUrl}
            style={{ maxWidth: '175px', maxHeight: '100px', width: 'auto', height: 'auto' }}
          />
        </Col>
        <Col span={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space direction="horizontal" size="middle" style={{ display: 'flex', alignItems: 'flex-start' }}>
            {assemblies.map((a) => (
              <Tag color="blue">{a}</Tag>
            ))}
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
          </Space>
        </Col>
      </Row>
      {showFullCard && (
        <Row>
          <BeaconOrganization organization={organization} bentoUrl={welcomeUrl} description={description} />
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
