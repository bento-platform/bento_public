import React from 'react';
import { Card, Typography } from 'antd';
import { BeaconOrganizationType } from '@/types/beacon';
const { Text, Link } = Typography;

const LINK_STYLE = { padding: '10px' };
const CARD_STYLES = { body: { background: '#f5f5f5', width: '100%' } };
const DEFAULT_DESCRIPTION = 'Bento beacon';

const BeaconOrganization = ({ organization, bentoUrl, description }: BeaconOrganizationProps) => {
  const displayDescription = description || DEFAULT_DESCRIPTION;

  return (
    <>
        <Card styles={CARD_STYLES}>
          <Text style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{displayDescription}</Text>
        </Card>
    </>
  );
};

export interface BeaconOrganizationProps {
  organization: BeaconOrganizationType;
  bentoUrl: string | undefined;
  description: string | undefined;
}

export default BeaconOrganization;
