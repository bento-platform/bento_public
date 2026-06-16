import { Fragment, useState } from 'react';
import type { PersonOrOrganization, Publication } from '@/types/dataset';
import { useTranslationFn } from '@/hooks';
import Orcid from './Orcid';

const _doiUrl = (doi: string) => {
  if (doi.startsWith('https')) {
    return doi;
  } else if (doi.startsWith('doi:')) {
    return doi.replace('doi:', 'https://doi.org/');
  } else {
    return `https://doi.org/${doi}`;
  }
};

const AuthorList = ({ authors }: { authors: PersonOrOrganization[] }) =>
  authors.map((a, ai) => {
    const sep = ai < authors.length - 1 ? ', ' : '';
    if (a.type === 'person') {
      const { name, contact, orcid } = a;
      return (
        <Fragment key={ai}>
          <span>
            {contact?.website ? (
              <a href={contact?.website} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            ) : (
              name
            )}
            {!!orcid && <Orcid orcid={orcid} />}
          </span>
          {sep}
        </Fragment>
      );
    } else {
      return (
        <span key={ai}>
          {a.name}
          {sep}
        </span>
      );
    }
  });

const EtAl = ({ authors }: { authors: PersonOrOrganization[] }) => {
  const [shown, setShown] = useState(false);
  return shown ? (
    <>
      <AuthorList authors={authors} />.
    </>
  ) : (
    <em
      title={authors.map((a) => a.name).join(', ')}
      style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', cursor: 'pointer' }}
      onClick={() => setShown(true)}
    >
      et al.
    </em>
  );
};

const PublicationString = ({ publication }: { publication: Publication }) => {
  const t = useTranslationFn();

  const authors = publication.authors ?? [];
  const { doi, publication_date: date, publication_type: type, publication_venue: venue, url } = publication;

  // --- Author list ---
  let authorsNode = null;
  if (authors.length) {
    if (authors.length > 6) {
      authorsNode = (
        <>
          <span>
            <AuthorList authors={authors.slice(0, 6)} />, <EtAl authors={authors.slice(6)} />
          </span>{' '}
        </>
      );
    } else {
      authorsNode = <AuthorList authors={authors} />;
    }
  }
  // --- Publication type (if not journal articles) ---
  const publicationType = type === 'Journal Article' ? '' : `${type}. `;
  // ---

  // --- Title ---
  let title = publication.title;
  if (title.endsWith('.')) {
    title += ' ';
  } else {
    title += '. ';
  }
  // ---

  // --- Publication venue ---
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
  // ---

  // --- Web availability ---
  let webAvailabilityNode = null;
  if (doi) {
    webAvailabilityNode = (
      <span>
        DOI:{' '}
        <a href={_doiUrl(doi)} target="_blank" rel="noopener noreferrer">
          {doi}
        </a>
      </span>
    );
  } else if (url) {
    webAvailabilityNode = (
      <span>
        {t('dataset.publication.available_from')}:{' '}
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </span>
    );
  }
  // ---

  return (
    <span>
      {authorsNode}
      {title}
      {publicationType}
      {venueNode}
      {date ? `${date}. ` : ''}
      {webAvailabilityNode}
    </span>
  );
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
