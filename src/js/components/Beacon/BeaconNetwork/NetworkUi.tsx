import Loader from '@/components/Loader';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';
import { useBeaconNetwork } from '@/features/beacon/hooks';
import { beaconNetworkQuery } from '@/features/beacon/networkQuery.store';
import { useAppSelector } from '@/hooks';

import BeaconQueryFormUi from '../BeaconCommon/BeaconQueryFormUi';
import NetworkBeacons from './NetworkBeacons';
import NetworkSearchResults from './NetworkSearchResults';

const NetworkUi = () => {
  const { beacons, isFetchingBeaconNetworkConfig, assemblyIds, currentQuerySections } = useBeaconNetwork();
  const isWaitingForNetworkResponse = useAppSelector(
    (state) => state.beaconNetworkResponse.networkResponseStatus == 'waiting'
  );

  return isFetchingBeaconNetworkConfig ? (
    <Loader />
  ) : (
    <div style={WRAPPER_STYLE}>
      <BeaconQueryFormUi
        isFetchingQueryResponse={isWaitingForNetworkResponse}
        isNetworkQuery={true}
        beaconAssemblyIds={assemblyIds}
        querySections={currentQuerySections}
        launchQuery={beaconNetworkQuery}
      />
      <NetworkSearchResults />
      <NetworkBeacons beacons={beacons} />
    </div>
  );
};

export default NetworkUi;
