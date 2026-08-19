import { Flex } from 'antd';
import SearchResultsCounts from '@/components/Search/SearchResultsCounts';
import type { OptionalDiscoveryResults } from '@/types/data';
import type { RequestStatus } from '@/types/requests';

const NodeCountsDisplay = ({ queryStatus, results }: NodeCountsDisplayProps) => (
  <Flex justify="center">
    <SearchResultsCounts mode="beacon-network" results={results} queryStatus={queryStatus} />
  </Flex>
);

export interface NodeCountsDisplayProps {
  queryStatus?: RequestStatus;
  results: OptionalDiscoveryResults;
}

export default NodeCountsDisplay;
