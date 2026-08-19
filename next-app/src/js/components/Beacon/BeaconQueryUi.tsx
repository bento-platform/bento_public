import { Flex } from 'antd';

import Loader from '@/components/Loader';
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
    <Flex vertical={true} align="center" justify="space-between">
      <BeaconQueryFormUi
        isFetchingQueryResponse={WAITING_STATES.includes(queryStatus)}
        isNetworkQuery={false}
        beaconAssemblyIds={beaconAssemblyIds}
        launchQuery={makeBeaconQuery}
        apiErrorMessage={apiErrorMessage}
        beaconFiltersBySection={beaconFilters}
      />
      <BeaconSearchResults />
    </Flex>
  );
};

export default BeaconQueryUi;
