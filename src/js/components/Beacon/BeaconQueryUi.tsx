import { useAppSelector } from '@/hooks';
import Loader from '@/components/Loader';
import BeaconSearchResults from './BeaconSearchResults';
import BeaconQueryFormUi from './BeaconCommon/BeaconQueryFormUi';
import { makeBeaconQuery } from '@/features/beacon/beacon.store';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';
import { useBeacon } from '@/features/beacon/hooks';

const BeaconQueryUi = () => {
  const { isFetchingBeaconConfig, beaconAssemblyIds, isFetchingQueryResponse } = useBeacon();
  const querySections = useAppSelector((state) => state.query.querySections);

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
      />
    </div>
  );
};

export default BeaconQueryUi;
