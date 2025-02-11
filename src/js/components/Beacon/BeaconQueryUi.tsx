import Loader from '@/components/Loader';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';
import { makeBeaconQuery } from '@/features/beacon/beacon.store';
import { useBeacon } from '@/features/beacon/hooks';
import { useAppSelector } from '@/hooks';

import BeaconSearchResults from './BeaconSearchResults';
import BeaconQueryFormUi from './BeaconCommon/BeaconQueryFormUi';

const BeaconQueryUi = () => {
  const { isFetchingBeaconConfig, beaconAssemblyIds, isFetchingQueryResponse, apiErrorMessage } = useBeacon();
  const { querySections } = useAppSelector((state) => state.query);

  return isFetchingBeaconConfig ? (
    <Loader nested={true} />
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
