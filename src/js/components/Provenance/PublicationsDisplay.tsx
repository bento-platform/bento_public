import { useState } from 'react';
import { type Publication, type PublicationType } from '@/types/dataset';

const ARTICLE_TYPES = [
  'Journal Article',
  'Conference Paper',
  'Workshop Paper',
  'Short Paper',
  'Preprint',
  'Software Paper',
  'Review Article',
  'Editorial',
  'Commentary',
] as PublicationType[];

const _doiUrl = (doi: string) => {
  if (doi.startsWith('https')) {
    return doi;
  } else if (doi.startsWith('doi:')) {
    return doi.replace('doi:', 'https://doi.org/');
  } else {
    return `https://doi.org/${doi}`;
  }
};

const EtAl = ({ text }: { text: string }) => {
  const [shown, setShown] = useState(false);
  return shown ? (
    <span>
      {text}
      {text.endsWith('.') ? '' : '.'}
    </span>
  ) : (
    <em
      title={text}
      style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', cursor: 'pointer' }}
      onClick={() => setShown(true)}
    >
      et al.
    </em>
  );
};

const PublicationString = ({ publication }: { publication: Publication }) => {
  const authors = (publication.authors ?? []).map((a) => a.name);
  const { doi, publication_date: date, publication_type: type, publication_venue: venue } = publication;

  if (typeof type === 'object') {
    return <span />; // TODO
  } else if (ARTICLE_TYPES.includes(type)) {
    let authorsNode = null;
    if (authors.length) {
      if (authors.length > 6) {
        authorsNode = (
          <>
            <span>
              {authors.slice(0, 6).join(', ')}, <EtAl text={authors.slice(6).join(', ')} />
            </span>{' '}
          </>
        );
      } else {
        authorsNode = authors.join(', ') + '. ';
      }
      // TODO
    }

    let title = publication.title;
    if (title.endsWith('.')) {
      title += ' ';
    } else {
      title += '. ';
    }

    let venueNode = null;
    if (venue) {
      venueNode = (
        <>
          <span>
            {venue.url ? (
              <a href={venue.url} target="_blank" rel="noopener noreferrer">
                {venue.name}
              </a>
            ) : (
              venue.name
            )}
            .
          </span>{' '}
        </>
      );
    }

    return (
      <span>
        {authorsNode}
        {title}
        {venueNode}
        {date ? `${date}. ` : ''}
        {doi ? (
          <span>
            DOI:{' '}
            <a href={_doiUrl(doi)} target="_blank" rel="noopener noreferrer">
              {doi}
            </a>
          </span>
        ) : null}
      </span>
    );
  } else {
    return <span />; // TODO
  }
};

const PublicationsDisplay = ({ publications }: { publications: Publication[] }) => {
  return publications.length === 1 ? (
    <PublicationString publication={publications[0]} />
  ) : (
    <ol reversed>
      {[...publications]
        .sort((a, b) => {
          if (a.publication_date && b.publication_date) {
            return b.publication_date.localeCompare(a.publication_date);
          } else if (a.publication_date) {
            return -1;
          } else if (b.publication_date) {
            return 1;
          } else {
            return a.title.localeCompare(b.title);
          }
        })
        .map((p, pi) => (
          <li key={pi}>
            <PublicationString publication={p} />
          </li>
        ))}
    </ol>
  );
};

export default PublicationsDisplay;
