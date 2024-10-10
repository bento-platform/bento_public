import { useAppSelector } from '@/hooks';
import Loader from '@/components/Loader';
import BeaconSearchResults from './BeaconSearchResults';
import BeaconQueryFormUi from './BeaconCommon/BeaconQueryFormUi';
import { makeBeaconQuery } from '@/features/beacon/beaconQuery.store';
import { WRAPPER_STYLE } from '@/constants/beaconConstants';

const BeaconQueryUi = () => {
  const isFetchingBeaconConfig = useAppSelector((state) => state.beaconConfig.isFetchingBeaconConfig);
  const beaconAssemblyIds = useAppSelector((state) => state.beaconConfig.beaconAssemblyIds);
  const querySections = useAppSelector((state) => state.query.querySections);
  const isFetchingBeaconQuery = useAppSelector((state) => state.beaconQuery.isFetchingQueryResponse);

  return isFetchingBeaconConfig ? (
    <Loader />
  ) : (
    <div style={WRAPPER_STYLE}>
      <BeaconSearchResults />
      <BeaconQueryFormUi
        isFetchingQueryResponse={isFetchingBeaconQuery}
        isNetworkQuery={false}
        beaconAssemblyIds={beaconAssemblyIds}
        querySections={querySections}
        launchQuery={makeBeaconQuery}
      />
    </div>
  );
};

export default BeaconQueryUi;
