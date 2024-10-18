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
const CARD_BODY_MIN_HEIGHT = '100px'; // fit stats without jumping
const LINK_STYLE = { padding: '4px' };

const ApiErrorTag = ({ errorMessage }: { errorMessage: string }) => (
  <Tooltip title={`Error response from beacon: ${errorMessage}`}>
    <Tag color="red">error</Tag>
  </Tooltip>
);

const NodeDetails = ({ beacon, response }: NodeDetailsProps) => {
  const { apiUrl, organization, overview } = beacon;
  const { variants } = overview;
  const assemblies = Object.keys(variants);
  const bentoUrl = apiUrl.replace('/api/beacon', '');

  const { isFetchingQueryResponse, apiErrorMessage, results } = response ?? {};

  const logo = (
    <img
      alt={`Logo for ${organization.name}`}
      src={organization.logoUrl}
      style={{ maxHeight: LOGO_MAX_HEIGHT, maxWidth: LOGO_MAX_WIDTH, padding: '4px' }}
    />
  );

  const orgName = <h4 style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{organization.name}</h4>;

  const logoAndName = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      {logo}
      {orgName}
    </div>
  );

  const assemblyTags = assemblies.map((a) => (
    <Tag color="blue" key={a}>
      {a}
    </Tag>
  ));

  return (
    <Card
      title={logoAndName}
      style={BOX_SHADOW}
      styles={{
        body: { flexGrow: 1, minHeight: CARD_BODY_MIN_HEIGHT },
        actions: { display: 'flex', alignItems: 'center' },
      }}
      extra={
        <>
          {assemblyTags}
          {apiErrorMessage && <ApiErrorTag errorMessage={apiErrorMessage} />}
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
      <NodeCountsDisplay isFetchingQueryResponse={isFetchingQueryResponse ?? false} results={results ?? {}} />
    </Card>
  );
};

export interface NodeDetailsProps {
  beacon: NetworkBeacon;
  response?: FlattenedBeaconResponse;
}

// memoize so we don't update all beacons each time one of them responds
export default memo(NodeDetails);
