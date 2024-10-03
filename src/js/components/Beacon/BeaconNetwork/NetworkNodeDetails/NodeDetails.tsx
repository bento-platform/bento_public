import { memo } from 'react';
import { Card, Tag, Tooltip, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import type { NetworkBeacon } from '@/types/beaconNetwork';
import type { FlattenedBeaconResponse } from '@/types/beacon';
import { BOX_SHADOW } from '@/constants/overviewConstants';
import NodeCountsDisplay from './NodeCountsDisplay';

const { Link } = Typography;

const LOGO_MAX_HEIGHT = '50px';
const LOGO_MAX_WIDTH = '175px';
const CARD_DEFAULT_WIDTH = '480px';
const CARD_BODY_MIN_HEIGHT = '100px'; // fit stats without jumping
const LINK_STYLE = { padding: '10px' };

const NodeDetails = ({ beacon, response }: NodeDetailsProps) => {
  const { apiUrl, organization, overview } = beacon;
  const { variants } = overview;
  const assemblies = Object.keys(variants);
  const bentoUrl = apiUrl.replace('/api/beacon', '');

  const { isFetchingQueryResponse, hasApiError, apiErrorMessage, individualCount, biosampleCount, experimentCount } =
    response;

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

  const assemblyTags = (
    <>
      {assemblies.map((a) => (
        <Tag color="blue" key={a}>
          {a}
        </Tag>
      ))}
    </>
  );

  const ApiErrorTag = ({ errorMessage }: { errorMessage: string }) => (
    <Tooltip title={`Error response from beacon: ${errorMessage}`}>
      <Tag color="red">error</Tag>
    </Tooltip>
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
        maxWidth: CARD_DEFAULT_WIDTH,
        width: '100%',
        ...BOX_SHADOW,
      }}
      styles={{
        body: { flexGrow: 1, minHeight: CARD_BODY_MIN_HEIGHT },
        actions: { display: 'flex', alignItems: 'center' },
      }}
      extra={
        <>
          {assemblyTags}
          {hasApiError && <ApiErrorTag errorMessage={apiErrorMessage} />}
        </>
      }
      actions={[
        <Link key="homepage" href={organization.welcomeUrl} target="_blank" style={LINK_STYLE}>
          <LinkOutlined style={{ marginRight: '5px' }} />
          Home Page
        </Link>,
        <Link key="bentolink" href={bentoUrl} target="_blank" style={LINK_STYLE}>
          <LinkOutlined style={{ marginRight: '5px' }} />
          Bento
        </Link>,
      ]}
    >
      <NodeCountsDisplay
        isFetchingQueryResponse={isFetchingQueryResponse}
        individualCount={individualCount}
        biosampleCount={biosampleCount}
        experimentCount={experimentCount}
      />
    </Card>
  );
};

export interface NodeDetailsProps {
  beacon: NetworkBeacon;
  response: FlattenedBeaconResponse;
}

// memoize so we don't update all beacons each time one of them responds
export default memo(NodeDetails);
