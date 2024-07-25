import React from 'react';
import { useAppSelector } from '@/hooks';
import { NetworkBeacon } from '@/types/beaconNetwork';
import BeaconDetails from './BeaconDetails';
import BeaconDetailsSquare from './BeaconDetailsSquare';
import BeaconDetailsSmall from './BeaconDetailsSmall';

// temp
const NetworkBeaconsSmall = ({ beacons }: NetworkBeaconsSmallProps) => {
  const beaconResponses = useAppSelector((state) => state.beaconNetworkResponse.beacons);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1200px', width: '100%' }}>
      {beacons.map((b) => (
        <BeaconDetailsSmall beacon={b} key={b.id} response={beaconResponses[b.id] ?? {}} />
      ))}
    </div>
  );
};

export interface NetworkBeaconsSmallProps {
  beacons: NetworkBeacon[];
}

export default NetworkBeaconsSmall;
