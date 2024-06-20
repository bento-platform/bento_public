import React from 'react';
import { useAppSelector } from '@/hooks';
import { NetworkBeacon } from '@/types/beaconNetwork';
import BeaconDetails from './BeaconDetails';

// for response, can either:
// handle in bulk here and pass as props
// handle in state in each individual component

const NetworkBeacons = ({ beacons }: NetworkBeaconsProps) => {
  // currently an object addressible by beacon id
  // a little odd when network "beacons" property is an array
  const beaconResponses = useAppSelector((state) => state.beaconNetworkResponse.beacons);

  // for now, show all beacons and update as they respond

  // for now render all beacons from the start
  // could show optionally if there are lot of beacon

  // may be able to get marginally fewer renders here by retrieving response from redux in each beacon instead of props
  return (
    <>
      {beacons.map((b) => (
        <BeaconDetails beacon={b} key={b.id} response={beaconResponses[b.id] ?? {}} />
      ))}
    </>
  );
};

export interface NetworkBeaconsProps {
  beacons: NetworkBeacon[];
}

export default NetworkBeacons;
