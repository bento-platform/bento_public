import Loader from '@/components/Loader';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';
import { makeBeaconQuery } from '@/features/beacon/beacon.store';
import { useBeacon } from '@/features/beacon/hooks';

import BeaconSearchResults from './BeaconSearchResults';
import BeaconQueryFormUi from './BeaconCommon/BeaconQueryFormUi';

const BeaconQueryUi = () => {
  const { isFetchingBeaconConfig, beaconAssemblyIds, beaconFilters, isFetchingQueryResponse, apiErrorMessage } =
    useBeacon();

  return isFetchingBeaconConfig ? (
    <Loader />
  ) : (
    <div style={WRAPPER_STYLE}>
      <BeaconSearchResults />
      <BeaconQueryFormUi
        isFetchingQueryResponse={isFetchingQueryResponse}
        isNetworkQuery={false}
        beaconAssemblyIds={beaconAssemblyIds}
        launchQuery={makeBeaconQuery}
        apiErrorMessage={apiErrorMessage}
        beaconFiltersBySection={beaconFilters}
      />
    </div>
  );
};

export default BeaconQueryUi;
