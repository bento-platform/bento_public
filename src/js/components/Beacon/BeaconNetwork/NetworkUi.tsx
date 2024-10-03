import { useAppSelector } from '@/hooks';
import NetworkBeacons from './NetworkBeacons';
import NetworkSearchResults from './NetworkSearchResults';
import BeaconQueryFormUi from '../BeaconCommon/BeaconQueryFormUi';
import Loader from '@/components/Loader';
import { beaconNetworkQuery } from '@/features/beacon/networkQuery.store';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';

const NetworkUi = () => {
  const beacons = useAppSelector((state) => state.beaconNetwork.beacons);
  const isFetchingConfig = useAppSelector((state) => state.beaconNetwork.isFetchingBeaconNetworkConfig);
  const networkAssemblyIds = useAppSelector((state) => state.beaconNetwork.assemblyIds);
  const networkQuerySections = useAppSelector((state) => state.beaconNetwork.currentQuerySections);
  const isWaitingForNetworkResponse = useAppSelector(
    (state) => state.beaconNetworkResponse.networkResponseStatus == 'waiting'
  );

  return isFetchingConfig ? (
    <Loader />
  ) : (
    <div style={WRAPPER_STYLE}>
      <BeaconQueryFormUi
        isFetchingQueryResponse={isWaitingForNetworkResponse}
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