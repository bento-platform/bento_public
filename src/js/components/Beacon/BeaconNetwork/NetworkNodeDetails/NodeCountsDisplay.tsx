import SearchResultsCounts from '@/components/Search/SearchResultsCounts';
import type { OptionalDiscoveryResults } from '@/types/data';
import type { RequestStatus } from '@/types/requests';

const NodeCountsDisplay = ({ queryStatus, results }: NodeCountsDisplayProps) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <SearchResultsCounts mode="beacon-network" results={results} queryStatus={queryStatus} />
  </div>
);

export interface NodeCountsDisplayProps {
  queryStatus?: RequestStatus;
  results: OptionalDiscoveryResults;
}

export default NodeCountsDisplay;
