import type { OntologyTerm } from '@/types/ontology';
import { useTranslationFn } from '@/hooks';
import OntologyTermComponent from '@Util/ClinPhen/OntologyTerm';

const FreeTextAndOrOntologyClass = ({
  text,
  ontologyClass,
  mode = 'default',
}: {
  text?: string;
  ontologyClass?: OntologyTerm;
  mode?: 'default' | 'experiment';
}) => {
  const t = useTranslationFn();
  // Cases:
  //  Mode: Default
  //  - only text --> render text
  //  - only ontology class --> render ontology class
  //  - both -->
  //      if text == ontology class label, only render ontology class
  //      otherwise, render both
  //  Mode: Experiment
  //  - Render Ontology if Ontology is present
  //  - Fallback to text otherwise

  if (mode === 'experiment' && !!ontologyClass) {
    text = undefined;
  }
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
