import React from 'react';
import { Card, Typography } from 'antd';
import { BeaconOrganizationType } from '@/types/beacon';
const { Text, Link } = Typography;

const LINK_STYLE = { padding: '10px' };
const CARD_STYLES = {
  body: { background: '#f5f5f5', width: '100%' },
};

const BeaconOrganization = ({ organization, bentoUrl, description }: BeaconOrganizationProps) => {
  return (
    <Card styles={CARD_STYLES}>
      <Text>{description}</Text>
      <div style={{ display: 'flex' }}>
        <Link href={organization.welcomeUrl} target="_blank" style={LINK_STYLE}>
          Home Page
        </Link>
        <Link href={bentoUrl} target="_blank" style={LINK_STYLE}>
          Bento
        </Link>
      </div>
    </Card>
  );
};

export interface BeaconOrganizationProps {
  organization: BeaconOrganizationType;
  bentoUrl: string | undefined;
  description: string | undefined;
}

export default BeaconOrganization;
