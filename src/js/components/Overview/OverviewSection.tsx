import type { ChartDataField } from '@/types/data';
import OverviewDisplayData from './OverviewDisplayData';
import OverviewCollapsibleSection from './Util/OverviewCollapsibleSection';

const OverviewSection = ({
  title,
  chartData,
  searchableFields,
}: {
  title: string;
  chartData: ChartDataField[];
  searchableFields: Set<string>;
}) => (
  <OverviewCollapsibleSection title={title}>
    <OverviewDisplayData section={title} allCharts={chartData} searchableFields={searchableFields} />
  </OverviewCollapsibleSection>
);

export default OverviewSection;
