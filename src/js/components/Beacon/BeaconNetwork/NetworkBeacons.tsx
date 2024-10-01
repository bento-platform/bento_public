import { useAppSelector } from '@/hooks';
import { NetworkBeacon } from '@/types/beaconNetwork';
import BeaconDetails from './NetworkNodeDetails/BeaconDetails';

// for response, can either:
// handle in bulk here and pass as props
// handle in state in each individual component

const NetworkBeacons = ({ beacons }: NetworkBeaconsProps) => {
  const beaconResponses = useAppSelector((state) => state.beaconNetworkResponse.beacons);

  // for now, render all beacons from the start and update as they respond (BeaconDetails component is memoized)
  // they could be shown optionally if beacon is very large (ie could just show beacon with non-zero responses)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1200px', width: '100%' }}>
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
