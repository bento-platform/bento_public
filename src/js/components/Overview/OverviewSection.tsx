import type { ChartSizeMode } from '@/features/ui/types';
import type { ChartDataField } from '@/types/data';
import OverviewDisplayData from './OverviewDisplayData';
import OverviewCollapsibleSection from './Util/OverviewCollapsibleSection';

const OverviewSection = ({
  title,
  chartData,
  searchableFields,
  chartMode,
}: {
  title: string;
  chartData: ChartDataField[];
  searchableFields: Set<string>;
  chartMode: ChartSizeMode;
}) => (
  <OverviewCollapsibleSection title={title}>
    <OverviewDisplayData
      section={title}
      allCharts={chartData}
      searchableFields={searchableFields}
      chartMode={chartMode}
    />
  </OverviewCollapsibleSection>
);

export default OverviewSection;
