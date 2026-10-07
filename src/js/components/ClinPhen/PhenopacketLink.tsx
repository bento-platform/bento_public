import { Fragment, type ReactNode, useCallback } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useCurrentScopePrefixedUrl } from '@/hooks/navigation';

import { Popover } from 'antd';
import BiosampleDetailView from '../Search/BiosampleDetailView';

import { getCurrentPage, highlightState } from '@/utils/router';
import { recordExploreBackEntry } from '@/utils/backNavigation';

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
 * Click handler for links to a phenopacket view: remembers the Explore page the user is leaving (with its search
 * intact in the URL), so the phenopacket page's back button can pop back to it. Links between phenopacket views don't
 * overwrite it, since the Explore page is then still the entry we want to get back to.
 */
const useRecordExploreOnClick = () => {
  const location = useLocation();
  return useCallback(() => {
    if (getCurrentPage(location) !== BentoRoute.Phenopackets) recordExploreBackEntry();
  }, [location]);
};

type BaseLinkProps = { packetId?: string; replace?: boolean; preserveQueryParams?: boolean; children?: ReactNode };

type SubjectLinkProps = BaseLinkProps;
const SubjectLink = ({ children, packetId, preserveQueryParams }: SubjectLinkProps) => {
  const url = usePhenopacketOverviewLink(packetId, 'subject', undefined, preserveQueryParams);
  const onClick = useRecordExploreOnClick();
  return (
    <Link to={url} state={highlightState('subject')} onClick={onClick}>
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
  const onClick = useRecordExploreOnClick();
  const link = (
    <Link to={url} replace={replace} state={highlightState('biosamples', sampleId)} onClick={onClick}>
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
  const onClick = useRecordExploreOnClick();
  return (
    <Link to={url} replace={replace} state={highlightState('experiments', experimentId)} onClick={onClick}>
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
  const onClick = useRecordExploreOnClick();
  return (
    <Link
      to={url}
      replace={replace}
      state={highlightState('experimentResults', experimentResultId.toString())}
      onClick={onClick}
    >
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
