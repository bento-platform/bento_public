import { Fragment } from 'react';
import { Typography } from 'antd';

import { useTranslationFn } from '@/hooks';
import type { ExternalLink } from '@/types/clinPhen/shared';

const DEFAULT_MAX_ROWS = 2;

type LinksListProps = {
  links: ExternalLink[];
  /** Maximum number of lines to show before collapsing behind a "Show more" button. 0 means no limit. */
  maxRows?: number;
};

/**
 * Renders a list of external links as a comma-separated, wrapping run of text. Long lists collapse to `maxRows` lines
 * with a "Show more" / "Show less" toggle. Renders nothing for an empty list.
 */
const LinksList = ({ links, maxRows = DEFAULT_MAX_ROWS }: LinksListProps) => {
  const t = useTranslationFn();

  if (!links.length) return null;

  return (
    <Typography.Paragraph
      className="mb-0"
      ellipsis={
        maxRows > 0
          ? {
              rows: maxRows,
              expandable: 'collapsible',
              symbol: (expanded: boolean) => t(`general.${expanded ? 'show_less' : 'show_more'}`),
            }
          : false
      }
    >
      {links.map((l, i) => (
        <Fragment key={`${l.label ?? ''}|${l.url}`}>
          {i > 0 && ', '}
          <Typography.Link href={l.url} target="_blank" rel="noopener noreferrer">
            {l.label || l.url}
          </Typography.Link>
        </Fragment>
      ))}
    </Typography.Paragraph>
  );
};

export default LinksList;
