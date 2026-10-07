import { Fragment, type ReactNode } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useCurrentScopePrefixedUrl } from '@/hooks/navigation';

import { Popover } from 'antd';
import BiosampleDetailView from '../Search/BiosampleDetailView';

import { getCurrentPage, highlightState } from '@/utils/router';

import type { ScopeLocationState } from '@/types/navigation';
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

/**
 * Link state for navigating to a phenopacket view: the highlight, plus how far back in history the Explore page the
 * user came from is, so the phenopacket page's back button can pop straight back to it (with its search intact)
 * rather than pushing a fresh Explore entry on top of the history.
 */
const usePhenopacketLinkState = (highlight: ReturnType<typeof highlightState>, replace: boolean = false) => {
  const location = useLocation();
  const prevDepth = (location.state as ScopeLocationState)?.exploreHistoryDepth;
  const onPhenopacketPage = getCurrentPage(location) === BentoRoute.Phenopackets;
  // From elsewhere (i.e., Explore) the page we're leaving is 1 entry back; from within a phenopacket view, a pushed
  // navigation adds an entry and a replaced one doesn't. If we landed on a phenopacket directly, there's no way back.
  const exploreHistoryDepth = onPhenopacketPage ? (prevDepth ? prevDepth + (replace ? 0 : 1) : undefined) : 1;
  return { ...highlight, exploreHistoryDepth };
};

type BaseLinkProps = { packetId?: string; replace?: boolean; preserveQueryParams?: boolean; children?: ReactNode };

type SubjectLinkProps = BaseLinkProps;
const SubjectLink = ({ children, packetId, preserveQueryParams }: SubjectLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'subject', undefined, preserveQueryParams);
  const state = usePhenopacketLinkState(highlightState('subject'));
  return (
    <Link to={url} state={state}>
      {children}
    </Link>
  );
};

type BiosampleLinkProps = BaseLinkProps & { sampleId: string; enablePopover?: boolean };
const BiosampleLink = ({
  packetId,
  sampleId,
  replace,
  preserveQueryParams,
  enablePopover,
  children,
}: BiosampleLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'biosamples', { biosample: sampleId }, preserveQueryParams);
  const state = usePhenopacketLinkState(highlightState('biosamples', sampleId), replace);
  const link = (
    <Link to={url} replace={replace} state={state}>
      {children ?? sampleId}
    </Link>
  );
  return enablePopover ? (
    <Popover content={<BiosampleDetailView id={sampleId} mode="popover" style={{ width: 'min(540px, 90vw)' }} />}>
      {link}
    </Popover>
  ) : (
    link
  );
};

type BiosampleLinkListProps = BaseLinkProps & { biosamples: string[]; enablePopover?: boolean };
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
  const state = usePhenopacketLinkState(highlightState('experiments', experimentId), replace);
  return (
    <Link to={url} replace={replace} state={state}>
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
  const state = usePhenopacketLinkState(highlightState('experimentResults', experimentResultId.toString()), replace);
  return (
    <Link to={url} replace={replace} state={state}>
      {children ?? experimentResultId}
    </Link>
  );
};

const PhenopacketLink = {
  Subject: SubjectLink,
  Biosample: BiosampleLink,
  Biosamples: BiosampleLinkList,
  Experiment: ExperimentLink,
  Experiments: ExperimentLinkList,
  ExperimentResult: ExperimentResultLink,
};

export default PhenopacketLink;
