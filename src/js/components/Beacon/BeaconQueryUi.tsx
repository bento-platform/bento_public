import Loader from '@/components/Loader';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';
import { WAITING_STATES } from '@/constants/requests';
import { makeBeaconQuery } from '@/features/beacon/beacon.store';
import { useBeacon } from '@/features/beacon/hooks';

import BeaconSearchResults from './BeaconSearchResults';
import BeaconQueryFormUi from './BeaconCommon/BeaconQueryFormUi';

const BeaconQueryUi = () => {
  const { configStatus, beaconAssemblyIds, beaconFilters, queryStatus, apiErrorMessage } = useBeacon();

  return WAITING_STATES.includes(configStatus) ? (
    <Loader />
  ) : (
    <div style={WRAPPER_STYLE}>
      <BeaconQueryFormUi
        isFetchingQueryResponse={WAITING_STATES.includes(queryStatus)}
        isNetworkQuery={false}
        beaconAssemblyIds={beaconAssemblyIds}
        launchQuery={makeBeaconQuery}
        apiErrorMessage={apiErrorMessage}
        beaconFiltersBySection={beaconFilters}
      />
      <BeaconSearchResults />
    </div>
  );
};

export default BeaconQueryUi;
