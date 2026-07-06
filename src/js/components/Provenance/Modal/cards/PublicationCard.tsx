import { useState } from 'react';
import { BookOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';

import type { Publication } from '@/types/dataset';
import { CopyButton } from './CopyButton';
import { personName, pubTypeLabel } from './helpers';

export const PublicationCard = ({
  pub,
  idx,
  copiedKey,
  onCopy,
}: {
  pub: Publication;
  idx: number;
  copiedKey: string | null;
  onCopy: (value: string, id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasAuthors = !!pub.authors?.length;
  const hasDetail = !!(pub.publication_venue || pub.doi || pub.url);

  return (
    <div className="pm-pub">
      <button
        type="button"
        className={`pm-pub-row${expanded ? ' expanded' : ''}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <DownOutlined className="pm-pub-chevron" style={!expanded ? { transform: 'rotate(-90deg)' } : undefined} />
        {pub.publication_date && <span className="pm-pub-year">{pub.publication_date.slice(0, 4)}</span>}
        {expanded ? (
          <div className="pm-pub-full">
            <div className="pm-pub-title-full">{pub.title}</div>
            {hasAuthors && (
              <div className="pm-pub-authors-full">{pub.authors!.map(personName).join(', ')}</div>
            )}
          </div>
        ) : (
          <>
            <span className="pm-pub-title-inline">{pub.title}</span>
            {hasAuthors && (
              <span className="pm-pub-authors-inline">{pub.authors!.map(personName).join(', ')}</span>
            )}
          </>
        )}
        <span className="pm-pub-type-mini">{pubTypeLabel(pub.publication_type)}</span>
      </button>

      {expanded && hasDetail && (
        <div className="pm-pub-detail">
          {pub.publication_venue && (
            <div className="pm-pub-venue">
              <BookOutlined />
              {pub.publication_venue.name}
              {pub.publication_venue.publisher && ` · ${pub.publication_venue.publisher}`}
            </div>
          )}
          {(pub.doi || pub.url) && (
            <div className="pm-pub-foot">
              {pub.doi && (
                <span className="pm-doi">
                  {pub.doi}
                  <CopyButton value={pub.doi} id={`doi-${idx}`} copiedKey={copiedKey} onCopy={onCopy} />
                </span>
              )}
              {pub.url && (
                <a className="pm-pub-view" href={pub.url} target="_blank" rel="noreferrer">
                  View publication <ExportOutlined />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
