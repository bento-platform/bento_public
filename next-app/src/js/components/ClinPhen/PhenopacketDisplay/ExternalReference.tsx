import { LinkOutlined } from '@ant-design/icons';
import { useTranslationFn } from '@/hooks';
import type { ExternalReference } from '@/types/clinPhen/shared';
import { isValidUrl } from '@/utils/strings';

const ExternalReference = ({ reference }: { reference: ExternalReference }) => {
  const t = useTranslationFn();

  return (
    <div>
      <strong>{t('general.id')}:</strong> {reference.id}{' '}
      {isValidUrl(reference.reference) ? (
        <a href={reference.reference} target="_blank" rel="noopener noreferrer">
          <LinkOutlined />
        </a>
      ) : null}
      <br />
      {reference?.description && (
        <>
          <strong>{t('Description')}:</strong> {t(reference?.description)}
        </>
      )}
    </div>
  );
};

export default ExternalReference;
