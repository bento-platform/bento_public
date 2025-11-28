import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLangPrefixedUrl } from '@/hooks/navigation';
import { PHENOPACKET_EXPANDED_URL_QUERY_KEY } from './PhenopacketDisplay/PhenopacketOverview';

const usePhenopacketOverviewLink = (
  packetId: string | undefined,
  expanded: string,
  otherArgs: Record<string, string> | undefined = undefined
) => {
  const baseUrl = useLangPrefixedUrl(`phenopackets/${packetId}/overview`);
  const params = new URLSearchParams({ [PHENOPACKET_EXPANDED_URL_QUERY_KEY]: expanded, ...(otherArgs ?? {}) });
  return `${baseUrl}?${params.toString()}`;
};

export const PhenopacketSubjectLink = ({ children, packetId }: { children: ReactNode; packetId?: string }) => {
  const url = usePhenopacketOverviewLink(packetId, 'subject');
  return packetId ? <Link to={url}>{children}</Link> : children;
};

export const PhenopacketBiosampleLink = ({ packetId, sampleId }: { packetId: string; sampleId: string }) => {
  const url = usePhenopacketOverviewLink(packetId, 'biosamples', { biosample: sampleId });
  return <Link to={url}>{sampleId}</Link>;
};

export const PhenopacketExperimentLink = ({ packetId, experimentId }: { packetId?: string; experimentId: string }) => {
  const url = usePhenopacketOverviewLink(packetId, 'experiments', { experiment: experimentId });
  return packetId ? <Link to={url}>{experimentId}</Link> : experimentId;
};

export const PhenopacketExperimentResultLink = ({
  packetId,
  experimentResultId,
  children,
}: {
  packetId?: string;
  experimentResultId: number;
  children?: ReactNode;
}) => {
  const url = usePhenopacketOverviewLink(packetId, 'experimentResults', {
    experimentResult: experimentResultId.toString(10),
  });
  children = children ?? experimentResultId;
  return packetId ? <Link to={url}>{children}</Link> : children;
};

export default {
  Subject: PhenopacketSubjectLink,
  Biosample: PhenopacketBiosampleLink,
  Experiment: PhenopacketExperimentLink,
  ExperimentResult: PhenopacketExperimentResultLink,
};
