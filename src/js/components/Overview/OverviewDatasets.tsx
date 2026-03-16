import type { Dataset as DatasetT } from '@/types/metadata';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import { EMPTY_KATSU_ENTITY_COUNTS } from '@/features/search/constants';
import Dataset from '@/components/Provenance/Dataset';
import OverviewCollapsibleSection from './Util/OverviewCollapsibleSection';

const OverviewDatasets = ({
  datasets,
  parentProjectID,
  countsByDataset,
}: {
  datasets: DatasetT[];
  parentProjectID: string;
  countsByDataset?: Record<string, KatsuEntityCountsOrBooleans>;
}) => {
  return (
    <OverviewCollapsibleSection title="entities.dataset_other">
      <div className="dataset-provenance-card-grid">
        {datasets.map((d) => (
          <div key={d.identifier}>
            <Dataset
              parentProjectID={parentProjectID}
              dataset={d}
              format="card"
              filteredCounts={countsByDataset ? (countsByDataset[d.identifier] ?? EMPTY_KATSU_ENTITY_COUNTS) : undefined}
            />
          </div>
        ))}
      </div>
    </OverviewCollapsibleSection>
  );
};

export default OverviewDatasets;
