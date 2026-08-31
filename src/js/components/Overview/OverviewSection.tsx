import type { ChartSizeMode } from '@/features/ui/types';
import type { Section } from '@/types/data';
import OverviewDisplayData from './OverviewDisplayData';
import OverviewCollapsibleSection from './Util/OverviewCollapsibleSection';

const OverviewSection = ({
  section: { sectionId, sectionTitle, charts },
  searchableFields,
  chartMode,
}: OverviewSectionProps) => (
  <OverviewCollapsibleSection title={sectionTitle}>
    <OverviewDisplayData
      section={sectionId}
      allCharts={charts}
      searchableFields={searchableFields}
      chartMode={chartMode}
    />
  </OverviewCollapsibleSection>
);

export interface OverviewSectionProps {
  section: Section;
  searchableFields: Set<string>;
  chartMode: ChartSizeMode;
}

export default OverviewSection;
