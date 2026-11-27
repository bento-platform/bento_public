import { Fragment } from 'react';
import { Typography } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import type { ExternalLink } from '@/types/clinPhen/shared';

type LinksListProps = {
  links?: ExternalLink[];
};

/**
 * Renders a list of external links as a comma-separated, wrapping run of text. Each link has an external link icon.
 * Renders nothing for an empty or missing list.
 */
const LinksList = ({ links }: LinksListProps) => {
  if (!links?.length) return null;

  return (
    <Typography.Paragraph className="mb-0">
      {links.map((l, i) => (
        <Fragment key={`${l.label ?? ''}|${l.url}`}>
          {i > 0 && ', '}
          <Typography.Link href={l.url} target="_blank" rel="noopener noreferrer">
            {l.label || l.url} <ExportOutlined style={{ fontSize: '0.81rem' }} />
          </Typography.Link>
        </Fragment>
      ))}
    </Typography.Paragraph>
  );
};

export default LinksList;
