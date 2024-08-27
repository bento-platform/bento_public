import React from 'react';
import { useAppSelector } from '@/hooks';
import { NetworkBeacon } from '@/types/beaconNetwork';
import BeaconDetails from './BeaconDetails';
// import BeaconDetailsSquare from './BeaconDetailsSquare';

// for response, can either:
// handle in bulk here and pass as props
// handle in state in each individual component

const NetworkBeacons = ({ beacons }: NetworkBeaconsProps) => {
  // currently an object addressable by beacon id
  // a little odd when network "beacons" property is an array
  const beaconResponses = useAppSelector((state) => state.beaconNetworkResponse.beacons);

  // for now, render all beacons from the start and update as they respond
  // they could be shown optionally if beacon is very large (ie could just show beacon with non-zero responses)

  // may be able to get marginally fewer renders here by retrieving response from redux in each beacon instead of props
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1200px', width: '100%' }}>
      {beacons.map((b) => (
        <BeaconDetails beacon={b} key={b.id} response={beaconResponses[b.id] ?? {}} />
      ))}
    </div>
  );
};

export interface NetworkBeaconsProps {
  beacons: NetworkBeacon[];
}

export default NetworkBeacons;
