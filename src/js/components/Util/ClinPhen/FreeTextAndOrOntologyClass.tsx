import type { OntologyTerm } from '@/types/ontology';
import { useTranslationFn } from '@/hooks';
import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';

const FreeTextAndOrOntologyClass = ({ text, ontologyClass }: { text?: string; ontologyClass?: OntologyTerm }) => {
  const t = useTranslationFn();
  // Cases:
  //  - only text --> render text
  //  - only ontology class --> render ontology class
  //  - both -->
  //      if text == ontology class label, only render ontology class
  //      otherwise, render both
  return text && (!ontologyClass || text !== ontologyClass.label) ? (
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
