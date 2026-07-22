import type { ReactNode } from 'react';
import { FaOrcid } from 'react-icons/fa';

const ORCID_GREEN = 'rgb(166, 206, 57)';

const Orcid = ({ orcid, children }: { orcid: string; children?: ReactNode }) => (
  <a
    href={`https://orcid.org/${orcid}`}
    title={`ORCiD: ${orcid}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ marginLeft: 4, ...(children ? {} : { color: ORCID_GREEN }) }}
  >
    {children ?? <FaOrcid />}
  </a>
);

export default Orcid;
