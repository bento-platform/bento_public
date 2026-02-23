import { Fragment, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCurrentScopePrefixedUrl } from '@/hooks/navigation';

import { BentoRoute } from '@/types/routes';
import { TabKeys } from '@/types/PhenopacketView.types';
import type { SectionKey } from '@/components/ClinPhen/PhenopacketDisplay/phenopacketOverview.registry';

import { PHENOPACKET_EXPANDED_URL_QUERY_KEY } from './PhenopacketDisplay/PhenopacketOverview';

const usePhenopacketOverviewLink = (
  packetId: string | undefined,
  expanded: SectionKey,
  otherArgs: Record<string, string> | undefined = undefined
) => {
  const { packetId: urlPId } = useParams();
  const derivedPacketId = packetId ?? urlPId;
  const baseUrl = useCurrentScopePrefixedUrl(`${BentoRoute.Phenopackets}/${derivedPacketId}/${TabKeys.OVERVIEW}`);
  const params = new URLSearchParams({ [PHENOPACKET_EXPANDED_URL_QUERY_KEY]: expanded, ...(otherArgs ?? {}) });
  return `${baseUrl}?${params.toString()}`;
};

type BaseLinkProps = { packetId?: string; replace?: boolean; children?: ReactNode };

type SubjectLinkProps = BaseLinkProps;
const SubjectLink = ({ children, packetId }: SubjectLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'subject');
  return <Link to={url}>{children}</Link>;
};

type BiosampleLinkProps = BaseLinkProps & { sampleId: string };
const BiosampleLink = ({ packetId, sampleId, replace, children }: BiosampleLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'biosamples', { biosample: sampleId });
  return <Link to={url} replace={replace}>{children ?? sampleId}</Link>;
};

type BiosampleLinkListProps = BaseLinkProps & { biosamples: string[] };
const BiosampleLinkList = ({ packetId, biosamples, replace }: BiosampleLinkListProps) => (
  <>
    {biosamples.map((bb, bbi) => (
      <Fragment key={bb}>
        <BiosampleLink packetId={packetId} sampleId={bb} replace={replace} />
        {bbi < biosamples.length - 1 ? ', ' : ''}
      </Fragment>
    ))}
  </>
);

type ExperimentLinkProps = BaseLinkProps & { experimentId: string };
const ExperimentLink = ({ packetId, experimentId, replace, children }: ExperimentLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'experiments', { experiment: experimentId });
  return <Link to={url} replace={replace}>{children ?? experimentId}</Link>;
};

type ExperimentResultLinkProps = BaseLinkProps & { experimentResultId: number };
const ExperimentResultLink = ({ packetId, experimentResultId, children, replace }: ExperimentResultLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'experimentResults', {
    experimentResult: experimentResultId.toString(10),
  });
  return <Link to={url} replace={replace}>{children ?? experimentResultId}</Link>;
};

type ExperimentLinkListProps = BaseLinkProps & { current?: string; experiments: string[] };
export const ExperimentLinkList = ({ packetId, current, experiments, replace }: ExperimentLinkListProps) => (
  <>
    {experiments.map((experimentId, i) => (
      <Fragment key={i}>
        <ExperimentLink
          packetId={current === experimentId ? undefined : packetId}
          experimentId={experimentId}
          replace={replace}
        />
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