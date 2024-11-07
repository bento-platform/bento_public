import Loader from '@/components/Loader';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';
import { makeBeaconQuery } from '@/features/beacon/beacon.store';
import { useBeacon } from '@/features/beacon/hooks';
import { useSearchQuery } from '@/features/search/hooks';

import BeaconSearchResults from './BeaconSearchResults';
import BeaconQueryFormUi from './BeaconCommon/BeaconQueryFormUi';

const BeaconQueryUi = () => {
  const { isFetchingBeaconConfig, beaconAssemblyIds, isFetchingQueryResponse, apiErrorMessage } = useBeacon();
  const { querySections } = useSearchQuery();

  return isFetchingBeaconConfig ? (
    <Loader />
  ) : (
    <div style={WRAPPER_STYLE}>
      <BeaconSearchResults />
      <BeaconQueryFormUi
        isFetchingQueryResponse={isFetchingQueryResponse}
        isNetworkQuery={false}
        beaconAssemblyIds={beaconAssemblyIds}
        querySections={querySections}
        launchQuery={makeBeaconQuery}
        apiErrorMessage={apiErrorMessage}
      />
    </div>
  );
};

export default BeaconQueryUi;
