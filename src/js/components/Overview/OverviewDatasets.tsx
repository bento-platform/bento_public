import type { Dataset as DatasetT } from '@/types/metadata';
import Dataset from '@/components/Provenance/Dataset';
import OverviewCollapsibleSection from './Util/OverviewCollapsibleSection';

const OverviewDatasets = ({ datasets, parentProjectID }: { datasets: DatasetT[]; parentProjectID: string }) => (
  <OverviewCollapsibleSection title="Datasets">
    <div className="dataset-provenance-card-grid">
      {datasets.map((d) => (
        <div key={d.identifier}>
          <Dataset parentProjectID={parentProjectID} dataset={d} format="card" />
        </div>
      ))}
    </div>
  </OverviewCollapsibleSection>
);

export default OverviewDatasets;
