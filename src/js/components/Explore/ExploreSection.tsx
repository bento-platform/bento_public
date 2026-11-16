import type { ChartSizeMode } from '@/features/ui/types';
import type { Section } from '@/types/data';
import ExploreDisplayData from './ExploreDisplayData';
import ExploreCollapsibleSection from './Util/ExploreCollapsibleSection';

const ExploreSection = ({
  section: { sectionId, sectionTitle, charts },
  searchableFields,
  chartMode,
}: ExploreSectionProps) => (
  <ExploreCollapsibleSection title={sectionTitle}>
    <ExploreDisplayData
      section={sectionId}
      allCharts={charts}
      searchableFields={searchableFields}
      chartMode={chartMode}
    />
  </ExploreCollapsibleSection>
);

export interface ExploreSectionProps {
  section: Section;
  searchableFields: Set<string>;
  chartMode: ChartSizeMode;
}

export default ExploreSection;
