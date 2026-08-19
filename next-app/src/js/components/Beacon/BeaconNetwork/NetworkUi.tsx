import { Flex } from 'antd';

import Loader from '@/components/Loader';
import { WAITING_STATES } from '@/constants/requests';
import { useBeaconNetwork } from '@/features/beacon/hooks';
import { beaconNetworkQuery } from '@/features/beacon/network.store';
import { atLeastOneNetworkResponseIsPending } from '@/features/beacon/utils';

import BeaconQueryFormUi from '../BeaconCommon/BeaconQueryFormUi';
import NetworkBeacons from './NetworkBeacons';
import NetworkSearchResults from './NetworkSearchResults';

const NetworkUi = () => {
  const { networkConfigStatus, assemblyIds, currentFilters, beaconResponses } = useBeaconNetwork();
  const isFetchingQueryResponse = atLeastOneNetworkResponseIsPending(beaconResponses);

  return WAITING_STATES.includes(networkConfigStatus) ? (
    <Loader />
  ) : (
    <Flex vertical={true} align="center" justify="space-between">
      <BeaconQueryFormUi
        isFetchingQueryResponse={isFetchingQueryResponse}
        isNetworkQuery={true}
        beaconAssemblyIds={assemblyIds}
        launchQuery={beaconNetworkQuery}
        beaconFiltersBySection={currentFilters}
      />
      <NetworkSearchResults />
      <NetworkBeacons />
    </Flex>
  );
};

export default NetworkUi;
