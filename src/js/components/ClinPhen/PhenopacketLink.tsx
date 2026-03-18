import { Fragment, type ReactNode } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useCurrentScopePrefixedUrl } from '@/hooks/navigation';

import { highlightState } from '@/utils/router';

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
  return (
    <Link to={url} state={highlightState('subject')}>
      {children}
    </Link>
  );
};

type BiosampleLinkProps = BaseLinkProps & { sampleId: string };
const BiosampleLink = ({ packetId, sampleId, replace, preserveQueryParams, children }: BiosampleLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'biosamples', { biosample: sampleId }, preserveQueryParams);
  return (
    <Link to={url} replace={replace} state={highlightState('biosamples', sampleId)}>
      {children ?? sampleId}
    </Link>
  );
};

type BiosampleLinkListProps = BaseLinkProps & { biosamples: string[] };
const BiosampleLinkList = ({ packetId, biosamples, replace, ...props }: BiosampleLinkListProps) => (
  <>
    {biosamples.map((bb, bbi) => (
      <Fragment key={bb}>
        <BiosampleLink packetId={packetId} sampleId={bb} replace={replace} {...props} />
        {bbi < biosamples.length - 1 ? ', ' : ''}
      </Fragment>
    ))}
  </>
);

type ExperimentLinkProps = BaseLinkProps & { experimentId: string };
const ExperimentLink = ({ packetId, experimentId, replace, preserveQueryParams, children }: ExperimentLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'experiments', { experiment: experimentId }, preserveQueryParams);
  return (
    <Link to={url} replace={replace} state={highlightState('experiments', experimentId)}>
      {children ?? experimentId}
    </Link>
  );
};

type ExperimentLinkListProps = BaseLinkProps & { experiments: string[]; current?: string };
const ExperimentLinkList = ({ packetId, experiments, replace, preserveQueryParams }: ExperimentLinkListProps) => (
  <>
    {experiments.map((e, i) => (
      <Fragment key={e}>
        <ExperimentLink
          packetId={packetId}
          experimentId={e}
          replace={replace}
          preserveQueryParams={preserveQueryParams}
        />
        {i < experiments.length - 1 ? ', ' : ''}
      </Fragment>
    ))}
  </>
);

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
    <Link to={url} replace={replace} state={highlightState('experimentResults', experimentResultId.toString())}>
      {children ?? experimentResultId}
    </Link>
  );
};

export default {
  Subject: SubjectLink,
  Biosample: BiosampleLink,
  Biosamples: BiosampleLinkList,
  Experiment: ExperimentLink,
  Experiments: ExperimentLinkList,
  ExperimentResult: ExperimentResultLink,
};
