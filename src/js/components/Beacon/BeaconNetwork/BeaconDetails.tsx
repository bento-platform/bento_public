import React, { useState } from 'react';
import { Button, Card, Col, Row, Skeleton, Space, Statistic, Tag, Typography } from 'antd';
import { TeamOutlined, EllipsisOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';
import ExpSvg from '../../Util/ExpSvg';
import { LinkOutlined } from '@ant-design/icons';
import { BOX_SHADOW, COUNTS_FILL } from '@/constants/overviewConstants';
import SearchResultsPane from '../../Search/SearchResultsPane';
import BeaconOrganization from './BeaconOrganization';
import { NetworkBeacon } from '@/types/beaconNetwork';

import { useAppSelector, useTranslationDefault } from '@/hooks';
import { FlattenedBeaconResponse } from '@/types/beacon';
const { Title, Link, Text } = Typography;

const LOGO_MAX_HEIGHT = '50px';
const LOGO_MAX_WIDTH = '175px';
const CARD_DEFAULT_WIDTH = '480px';
const CARD_FULL_DETAILS_WIDTH = '1200px';
const CARD_BODY_MIN_HEIGHT = '100px'; // fit stats without jumping
const LINK_STYLE = { padding: '10px' };

// try header with logo and name, more "more" and error stuff elsewhere
// beacon needs to know its id to know which response to retrieve
// this might not work for reducing renders (may need to use)

const BeaconDetails = ({ beacon, response }: BeaconDetailsProps) => {
  const t = useTranslationDefault();
  const { apiUrl, organization, description, overview } = beacon;
  const { variants } = overview;
  const assemblies = Object.keys(variants);
  const bentoUrl = apiUrl.replace('/api/beacon', '');

  console.log('BeaconDetails');

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

  const ORG_PLACEHOLDER_TEXT = 'This is a Bento Beacon instance';

  const toggleFullCard = () => {
    setShowFullCard(!showFullCard);
  };

  const logo = (
    <img src={organization.logoUrl} style={{ maxHeight: LOGO_MAX_HEIGHT, maxWidth: LOGO_MAX_WIDTH, padding: '5px' }} />
  );

  const orgName = <h4 style={{ paddingLeft: '15px' }}>{organization.name}</h4>;

  const logoAndName = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {logo}
      {orgName}
    </div>
  );

  const orgSmall = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f5',
        whiteSpace: 'pre-line',
        width: '100%',
        padding: '10px 5px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Text>{description || ORG_PLACEHOLDER_TEXT}</Text>
      </div>
      {/* <div style={{ display: 'flex' }}>
        <Link href={organization.welcomeUrl} target="_blank" style={LINK_STYLE}>
          Home Page
        </Link>
        <Link href={bentoUrl} target="_blank" style={LINK_STYLE}>
          Bento
        </Link>
      </div> */}
    </div>
  );

  const assemblyTags = (
    <>
      {assemblies.map((a) => (
        <Tag color="blue" key={a}>
          {a}
        </Tag>
      ))}
    </>
  );

  return (
    <Card
      title={logoAndName}
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '5px',
        borderRadius: '10px',
        padding: '5px',
        maxWidth: showFullCard ? CARD_FULL_DETAILS_WIDTH : CARD_DEFAULT_WIDTH,
        width: '100%',
        // minHeight: '328px', // leave enough room for stats skeleton
        ...BOX_SHADOW,
      }}
      styles={{
        body: { flexGrow: 1, minHeight: CARD_BODY_MIN_HEIGHT },
        actions: { display: 'flex', alignItems: 'center' },
      }}
      extra={assemblyTags}
      actions={[
        <Link href={organization.welcomeUrl} target="_blank" style={LINK_STYLE}>
          <LinkOutlined style={{ marginRight: '5px' }} />
          Home Page
        </Link>,
        <Link href={bentoUrl} target="_blank" style={LINK_STYLE}>
          <LinkOutlined style={{ marginRight: '5px' }} />
          Bento
        </Link>,

        <Button ghost onClick={toggleFullCard}>
        {showFullCard? <Text>less</Text> : <Text>more</Text>}
        </Button>,
      ]}
    >
      {/* <Row gutter={[8, 8]}> */}
        {/* {orgSmall} */}

        <div style={{display: 'flex', justifyContent: "center"}}>
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
        </div>
      {/* </Row> */}
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

// memoize so we don't update all beacons each time one of them responds
export default React.memo(BeaconDetails);
