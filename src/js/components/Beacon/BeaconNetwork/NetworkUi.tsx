import Loader from '@/components/Loader';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';
import { useBeaconNetwork } from '@/features/beacon/hooks';
import { beaconNetworkQuery } from '@/features/beacon/network.store';
import { atLeastOneNetworkResponseIsPending } from '@/features/beacon/utils';

import BeaconQueryFormUi from '../BeaconCommon/BeaconQueryFormUi';
import NetworkBeacons from './NetworkBeacons';
import NetworkSearchResults from './NetworkSearchResults';

const NetworkUi = () => {
  const { isFetchingBeaconNetworkConfig, assemblyIds, currentQuerySections, beaconResponses } = useBeaconNetwork();
  const isFetchingQueryResponse = atLeastOneNetworkResponseIsPending(beaconResponses);

  return isFetchingBeaconNetworkConfig ? (
    <Loader />
  ) : (
    <div style={WRAPPER_STYLE}>
      <BeaconQueryFormUi
        isFetchingQueryResponse={isFetchingQueryResponse}
        isNetworkQuery={true}
        beaconAssemblyIds={assemblyIds}
        querySections={currentQuerySections}
        launchQuery={beaconNetworkQuery}
      />
      <NetworkSearchResults />
      <NetworkBeacons />
    </div>
  );
};

export default NetworkUi;