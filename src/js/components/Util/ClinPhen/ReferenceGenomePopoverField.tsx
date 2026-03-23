import { Popover, Space, Typography } from 'antd';

import type { ConditionalDescriptionItem } from '@/types/descriptions';
import { RequestStatus } from '@/types/requests';

import InteractableText from '@Util/InteractableText';
import OntologyTerm from '@Util/ClinPhen/OntologyTerm';
import TDescriptions from '@Util/TDescriptions';

import { useReference } from '@/features/reference/hooks';

const { Link } = Typography;

const ReferenceGenomePopoverField = ({ referenceGenomeId }: { referenceGenomeId: string | undefined }) => {
  const { genomesStatus, genomesByID } = useReference();

  if (genomesStatus === RequestStatus.Fulfilled && referenceGenomeId && genomesByID[referenceGenomeId]) {
    const rgInfo = genomesByID[referenceGenomeId];

    const items: ConditionalDescriptionItem[] = [
      { key: 'Taxon', children: <OntologyTerm term={rgInfo.taxon} italic /> },
      { key: 'FASTA', children: <Link href={rgInfo.fasta}>{rgInfo.fasta}</Link> },
      { key: 'FAI', children: <Link href={rgInfo.fai}>{rgInfo.fai}</Link> },
      { key: 'GFF3.gz', children: <Link href={rgInfo?.gff3_gz}>{rgInfo?.gff3_gz}</Link>, isVisible: rgInfo?.gff3_gz },
      {
        key: 'GFF3.gz TBI',
        children: <Link href={rgInfo?.gff3_gz_tbi}>{rgInfo?.gff3_gz_tbi}</Link>,
        isVisible: rgInfo?.gff3_gz_tbi,
      },
      {
        key: 'FASTA Checksums',
        children: (
          <Space size={0} direction="vertical">
            <div>
              <strong>MD5:</strong> {rgInfo.md5}
            </div>
            <div>
              <strong>GA4GH:</strong> {rgInfo.ga4gh}
            </div>
          </Space>
        ),
      },
    ];
    const content = <TDescriptions column={1} items={items} size="compact" bordered />;
    return (
      <Popover content={content}>
        <InteractableText>{referenceGenomeId}</InteractableText>
      </Popover>
    );
  }

  return referenceGenomeId;
};

export default ReferenceGenomePopoverField;
