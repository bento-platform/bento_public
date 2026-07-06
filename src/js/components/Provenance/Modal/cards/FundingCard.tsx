import { DollarOutlined, LinkOutlined } from '@ant-design/icons';

import type { FundingSource, Link, PersonOrOrganization } from '@/types/dataset';
import { personName } from './helpers';

export const FundingCard = ({ source, idx }: { source: FundingSource | Link; idx: number }) => {
  if ('url' in source && 'label' in source) {
    const link = source as Link;
    return (
      <div className="pm-fcard">
        <div className="pm-fc-top">
          <span className="pm-fc-ic"><LinkOutlined /></span>
          <div>
            <div className="pm-fc-name">
              <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const fs = source as FundingSource;
  const funderName =
    !fs.funder ? null
    : typeof fs.funder === 'string' ? fs.funder
    : personName(fs.funder as PersonOrOrganization);

  return (
    <div className="pm-fcard">
      <div className="pm-fc-top">
        <span className="pm-fc-ic"><DollarOutlined /></span>
        <div>
          {funderName && <div className="pm-fc-name">{funderName}</div>}
        </div>
      </div>
      {fs.grant_numbers && fs.grant_numbers.length > 0 && (
        <div className="pm-grants">
          <span className="pm-grant-k">Grant numbers</span>
          {fs.grant_numbers.map((g, i) => (
            <span key={i} className="pm-grant">{g}</span>
          ))}
        </div>
      )}
    </div>
  );
};
