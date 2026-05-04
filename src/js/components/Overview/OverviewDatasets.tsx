import type { DatasetV2 } from '@/types/datasetV2';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import { EMPTY_KATSU_ENTITY_COUNTS } from '@/features/search/constants';
import Dataset from '@/components/Provenance/Dataset';
import OverviewCollapsibleSection from './Util/OverviewCollapsibleSection';

const OverviewDatasets = ({
  datasets,
  parentProjectID,
  countsByDataset,
}: {
  datasets: DatasetV2[];
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
              filteredCounts={
                countsByDataset ? (countsByDataset[d.identifier] ?? EMPTY_KATSU_ENTITY_COUNTS) : d.counts_by_entity
              }
            />
          </div>
        ))}
      </div>
    </OverviewCollapsibleSection>
  );
};

export default OverviewDatasets;
