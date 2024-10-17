import SearchResultsCounts from '@/components/Search/SearchResultsCounts';
import type { OptionalDiscoveryResults } from '@/types/data';

const NodeCountsDisplay = ({ isFetchingQueryResponse, results }: NodeCountsDisplayProps) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <SearchResultsCounts mode="beacon-network" results={results} isFetchingQueryResponse={isFetchingQueryResponse} />
  </div>
);

export interface NodeCountsDisplayProps {
  isFetchingQueryResponse: boolean;
  results: OptionalDiscoveryResults;
}

export default NodeCountsDisplay;
