import type { Dataset } from '@/types/dataset';
import LongDescription from '@Util/LongDescription';
import { useTranslationFn } from '@/hooks';

const DatasetDescription = ({ dataset }: { dataset: Dataset }) => {
  const t = useTranslationFn();
  return dataset.long_description ? (
    <LongDescription content={dataset.long_description.content} contentType={dataset.long_description.content_type} />
  ) : (
    <p className="lede">{t(dataset.description)}</p>
  );
};

export default DatasetDescription;
