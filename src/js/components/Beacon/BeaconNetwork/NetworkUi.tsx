import { useAppSelector } from '@/hooks';
import NetworkBeacons from './NetworkBeacons';
import NetworkSearchResults from './NetworkSearchResults';
import BeaconQueryFormUi from '../BeaconCommon/BeaconQueryFormUi';
import { beaconNetworkQuery } from '@/features/beacon/networkQuery.store';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';

const NetworkUi = () => {
  const beacons = useAppSelector((state) => state.beaconNetwork.beacons);
  const isFetchingConfig = useAppSelector((state) => state.beaconNetwork.isFetchingBeaconNetworkConfig);
  const networkAssemblyIds = useAppSelector((state) => state.beaconNetwork.assemblyIds);
  const networkQuerySections = useAppSelector((state) => state.beaconNetwork.currentQuerySections);

  return (
    <div style={WRAPPER_STYLE}>
      <BeaconQueryFormUi
        isFetchingConfig={isFetchingConfig}
        isFetchingQueryResponse={false} //TODO? this is n/a here
        isNetworkQuery={true}
        beaconAssemblyIds={networkAssemblyIds}
        querySections={networkQuerySections}
        launchQuery={beaconNetworkQuery}
      />
      <NetworkSearchResults />
      <NetworkBeacons beacons={beacons} />
    </div>
  );
};

export default NetworkUi;
