import { Fragment, type ReactNode } from 'react';
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

// TODO: replace with context?
type BaseLinkProps = { packetId?: string };

type SubjectLinkProps = BaseLinkProps & { children: ReactNode };
const SubjectLink = ({ children, packetId }: SubjectLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'subject');
  return packetId ? <Link to={url}>{children}</Link> : children;
};

type BiosampleLinkProps = BaseLinkProps & { sampleId: string };
const BiosampleLink = ({ packetId, sampleId }: BiosampleLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'biosamples', { biosample: sampleId });
  return packetId ? <Link to={url}>{sampleId}</Link> : sampleId;
};

type BiosampleLinkListProps = BaseLinkProps & { biosamples: string[] };
const BiosampleLinkList = ({ packetId, biosamples }: BiosampleLinkListProps) => (
  <>
    {biosamples.map((bb, bbi) => (
      <Fragment key={bb}>
        <BiosampleLink packetId={packetId} sampleId={bb} />
        {bbi < biosamples.length - 1 ? ', ' : ''}
      </Fragment>
    ))}
  </>
);

type ExperimentLinkProps = BaseLinkProps & { experimentId: string };
const ExperimentLink = ({ packetId, experimentId }: ExperimentLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'experiments', { experiment: experimentId });
  return packetId ? <Link to={url}>{experimentId}</Link> : experimentId;
};

type ExperimentResultLinkProps = BaseLinkProps & { experimentResultId: string; children?: ReactNode };
const ExperimentResultLink = ({ packetId, experimentResultId, children }: ExperimentResultLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'experimentResults', { experimentResult: experimentResultId });
  children = children ?? experimentResultId;
  return packetId ? <Link to={url}>{children}</Link> : children;
};

type ExperimentLinkListProps = BaseLinkProps & { current?: string; experiments: string[] };
export const ExperimentLinkList = ({ packetId, current, experiments }: ExperimentLinkListProps) => (
  <>
    {experiments.map((experimentId, i) => (
      <Fragment key={i}>
        <ExperimentLink packetId={current === experimentId ? undefined : packetId} experimentId={experimentId} />
        {i < experiments.length - 1 ? ', ' : ''}
      </Fragment>
    ))}
  </>
);

export default {
  Subject: SubjectLink,
  Biosample: BiosampleLink,
  Biosamples: BiosampleLinkList,
  Experiment: ExperimentLink,
  Experiments: ExperimentLinkList,
  ExperimentResult: ExperimentResultLink,
};
