import { useHasScopeQueryData } from '@/hooks';
import type { Dataset as DatasetT } from '@/types/metadata';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import Dataset from '@/components/Provenance/Dataset';
import OverviewCollapsibleSection from './Util/OverviewCollapsibleSection';

const OverviewDatasets = ({ datasets, parentProjectID, countsByDataset }: { datasets: DatasetT[]; parentProjectID: string; countsByDataset?: Record<string, KatsuEntityCountsOrBooleans>;}) => {
const isAuthorized = useHasScopeQueryData();

console.log(isAuthorized, "isAuthorized")

return (
  <OverviewCollapsibleSection title="entities.dataset_other">
    <div className="dataset-provenance-card-grid">
      {datasets.map((d) => (
        <div key={d.identifier}>
          <Dataset 
            parentProjectID={parentProjectID} 
            dataset={d} 
            format="card" 
            filteredCounts={countsByDataset?.[d.identifier]}
            />
        </div>
      ))}
    </div>
  </OverviewCollapsibleSection>
);

}
  
export default OverviewDatasets;
