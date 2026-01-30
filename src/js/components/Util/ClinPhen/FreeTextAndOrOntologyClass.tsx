import type { OntologyTerm } from '@/types/ontology';
import { useTranslationFn } from '@/hooks';
import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';

const FreeTextAndOrOntologyClass = ({ text, ontologyClass }: { text?: string; ontologyClass?: OntologyTerm }) => {
  const t = useTranslationFn();
  return text ? (
    ontologyClass ? (
      <>
        {text} ({t('general.ontology_class')}: <OntologyTermComponent term={ontologyClass} />)
      </>
    ) : (
      text
    )
  ) : (
    <OntologyTermComponent term={ontologyClass} />
  );
};

export default FreeTextAndOrOntologyClass;
