import { memo } from 'react';

import { EM_DASH } from '@/constants/contentConstants';
import type {
  TimeElement,
  TimeElementAge,
  TimeElementAgeRange,
  TimeElementGestationalAge,
  TimeElementInterval,
  TimeElementOntologyClass,
  TimeElementTimestamp,
  TimeInterval,
} from '@/types/clinphen/shared';
import { useTranslationFn } from '@/hooks';

type TimeElementType = 'age' | 'gestational_age' | 'age_range' | 'ontology_class' | 'timestamp' | 'interval';
const TIME_ELEMENT_TYPES = ['age', 'gestational_age', 'age_range', 'ontology_class', 'timestamp', 'interval'];

const getTimeElementType = (element: TimeElement): TimeElementType | null => {
  const keys = Object.keys(element);
  if (keys.length === 1) {
    // A Phenopacket TimeElement should only have 1 property
    if (TIME_ELEMENT_TYPES.includes(keys[0])) {
      return keys[0] as TimeElementType;
    }
  }
  return null;
};

export const TimeIntervalDisplay = ({ timeInterval, br }: { timeInterval: TimeInterval; br?: boolean }) => {
  const t = useTranslationFn();
  return (
    <span>
      <strong>{t('time.start')}:</strong> {timeInterval.start}
      {br ? <br /> : ' '}
      <strong>{t('time.end')}:</strong> {timeInterval.end}
    </span>
  );
};

const InnerTimeElement = ({ type, element }: { type: TimeElementType; element: TimeElement }) => {
  const t = useTranslationFn();
  switch (type) {
    case 'age':
      return (element as TimeElementAge).age.iso8601duration;
    case 'gestational_age': {
      const ga = (element as TimeElementGestationalAge).gestational_age;
      return (
        <>
          <strong>{t('time.weeks')}:</strong> {ga.weeks}
          <strong>{t('time.days')}:</strong> {ga.days}
        </>
      );
    }
    case 'age_range': {
      const ar = (element as TimeElementAgeRange).age_range;
      return (
        <>
          <strong>{t('time.start')}:</strong> {ar.start.iso8601duration} <strong>{t('time.end')}:</strong>{' '}
          {ar.end.iso8601duration}
        </>
      );
    }
    case 'ontology_class':
      // TODO: display with ontology class component
      return (element as TimeElementOntologyClass).ontology_class.label;
    case 'timestamp':
      return (element as TimeElementTimestamp).timestamp;
    case 'interval':
      return <TimeIntervalDisplay timeInterval={(element as TimeElementInterval).interval} />;
    default:
      return EM_DASH;
  }
};

const TimeElementDisplay = memo(({ element }: { element?: TimeElement }) => {
  const t = useTranslationFn();

  if (!element) {
    return EM_DASH;
  }

  const timeType = getTimeElementType(element);

  if (!timeType) {
    // Unexpected TimeElement type
    console.error('Bad time element:', element);
    return EM_DASH;
  }

  return (
    <span>
      <strong>{t(`time.${timeType}`)}: </strong>
      <InnerTimeElement type={timeType} element={element} />
    </span>
  );
});

TimeElementDisplay.displayName = 'TimeElementDisplay';

export default TimeElementDisplay;
