import { useAppSelector } from '@/hooks';
import BeaconSearchResults from './BeaconSearchResults';
import BeaconQueryFormUi from './BeaconCommon/BeaconQueryFormUi';
import { makeBeaconQuery } from '@/features/beacon/beaconQuery.store';
import { WRAPPER_STYLE,} from '@/constants/beaconConstants';
import Loader from '@/components/Loader';

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
        isFetchingConfig={false}  //already fetched
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
