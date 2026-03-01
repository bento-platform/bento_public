import { Fragment, type ReactNode } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useCurrentScopePrefixedUrl } from '@/hooks/navigation';

import { BentoRoute } from '@/types/routes';
import { TabKeys } from '@/types/PhenopacketView.types';
import type { SectionKey } from '@/components/ClinPhen/PhenopacketDisplay/phenopacketOverview.registry';

import { PHENOPACKET_EXPANDED_URL_QUERY_KEY } from './PhenopacketDisplay/PhenopacketOverview';

const usePhenopacketOverviewLink = (
  packetId: string | undefined,
  expanded: SectionKey,
  otherArgs: Record<string, string> | undefined = undefined,
  preserveQueryParams: boolean = false
) => {
  const { packetId: urlPId } = useParams();
  const [searchParams] = useSearchParams();
  const derivedPacketId = packetId ?? urlPId;
  const baseUrl = useCurrentScopePrefixedUrl(`${BentoRoute.Phenopackets}/${derivedPacketId}/${TabKeys.OVERVIEW}`);

  // Build the expanded value, merging with existing expanded sections if preserving
  const expandedValue = preserveQueryParams
    ? Array.from(new Set([...(searchParams.get(PHENOPACKET_EXPANDED_URL_QUERY_KEY)?.split(',') ?? []), expanded]))
        .filter(Boolean)
        .join(',')
    : expanded;

  const newParams: Record<string, string> = {
    [PHENOPACKET_EXPANDED_URL_QUERY_KEY]: expandedValue,
    ...(otherArgs ?? {}),
  };

  const params = preserveQueryParams
    ? new URLSearchParams([
        ...Array.from(searchParams.entries()).filter(([key]) => !(key in newParams)),
        ...Object.entries(newParams),
      ])
    : new URLSearchParams(newParams);

  return `${baseUrl}?${params.toString()}`;
};

type BaseLinkProps = { packetId?: string; replace?: boolean; preserveQueryParams?: boolean; children?: ReactNode };

type SubjectLinkProps = BaseLinkProps;
const SubjectLink = ({ children, packetId, preserveQueryParams }: SubjectLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'subject', undefined, preserveQueryParams);
  return <Link to={url}>{children}</Link>;
};

type BiosampleLinkProps = BaseLinkProps & { sampleId: string };
const BiosampleLink = ({ packetId, sampleId, replace, preserveQueryParams, children }: BiosampleLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'biosamples', { biosample: sampleId }, preserveQueryParams);
  return (
    <Link to={url} replace={replace}>
      {children ?? sampleId}
    </Link>
  );
};

type BiosampleLinkListProps = BaseLinkProps & { biosamples: string[] };
const BiosampleLinkList = ({ packetId, biosamples, replace, preserveQueryParams }: BiosampleLinkListProps) => (
  <>
    {biosamples.map((bb, bbi) => (
      <Fragment key={bb}>
        <BiosampleLink packetId={packetId} sampleId={bb} replace={replace} preserveQueryParams={preserveQueryParams} />
        {bbi < biosamples.length - 1 ? ', ' : ''}
      </Fragment>
    ))}
  </>
);

type ExperimentLinkProps = BaseLinkProps & { experimentId: string };
const ExperimentLink = ({ packetId, experimentId, replace, preserveQueryParams, children }: ExperimentLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'experiments', { experiment: experimentId }, preserveQueryParams);
  return (
    <Link to={url} replace={replace}>
      {children ?? experimentId}
    </Link>
  );
};

type ExperimentResultLinkProps = BaseLinkProps & { experimentResultId: number };
const ExperimentResultLink = ({
  packetId,
  experimentResultId,
  children,
  replace,
  preserveQueryParams,
}: ExperimentResultLinkProps) => {
  const url = usePhenopacketOverviewLink(
    packetId,
    'experimentResults',
    { experimentResult: experimentResultId.toString(10) },
    preserveQueryParams
  );
  return (
    <Link to={url} replace={replace}>
      {children ?? experimentResultId}
    </Link>
  );
};

type ExperimentLinkListProps = BaseLinkProps & { current?: string; experiments: string[] };
export const ExperimentLinkList = ({
  packetId,
  current,
  experiments,
  replace,
  preserveQueryParams,
}: ExperimentLinkListProps) => (
  <>
    {experiments.map((experimentId, i) => (
      <Fragment key={i}>
        <ExperimentLink
          packetId={current === experimentId ? undefined : packetId}
          experimentId={experimentId}
          replace={replace}
          preserveQueryParams={preserveQueryParams}
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
