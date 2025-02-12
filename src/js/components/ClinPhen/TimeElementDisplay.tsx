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

type TimeElementType = 'age' | 'gestational_age' | 'age_range' | 'ontology_class' | 'timestamp' | 'interval';

const TIME_ELEMENT_TYPES_LABELS: Record<TimeElementType, string> = {
  age: 'Age',
  gestational_age: 'Gestational Age',
  age_range: 'Age Range',
  ontology_class: 'Ontology Class',
  timestamp: 'Timestamp',
  interval: 'Interval',
};

const getTimeElementTypeLabel = (element: TimeElement): [TimeElementType | null, string] => {
  const keys = Object.keys(element);
  if (keys.length === 1) {
    // A Phenopacket TimeElement should only have 1 property
    const type = keys[0] as TimeElementType;
    if (type in TIME_ELEMENT_TYPES_LABELS) {
      const label = TIME_ELEMENT_TYPES_LABELS[type];
      return [type, label];
    }
  }
  return [null, 'NOT_SUPPORTED'];
};

export const TimeIntervalDisplay = ({ timeInterval, br }: { timeInterval: TimeInterval; br?: boolean }) => {
  return (
    <span>
      <strong>Start:</strong> <>{timeInterval.start}</>
      {br ? <br /> : ' '}
      <strong>End:</strong> <>{timeInterval.end}</>
    </span>
  );
};

const InnerTimeElement = ({ type, element }: { type: TimeElementType; element: TimeElement }) => {
  switch (type) {
    case 'age':
      return <span>{(element as TimeElementAge).age.iso8601duration}</span>;
    case 'gestational_age': {
      const ga = (element as TimeElementGestationalAge).gestational_age;
      return (
        <span>
          <strong>Weeks:</strong> {ga.weeks}
          <strong>Days:</strong> {ga.days}
        </span>
      );
    }
    case 'age_range': {
      const ar = (element as TimeElementAgeRange).age_range;
      return (
        <span>
          <strong>Start:</strong> <>{ar.start.iso8601duration}</> <strong>End:</strong> <>{ar.end.iso8601duration}</>
        </span>
      );
    }
    case 'ontology_class':
      return (element as TimeElementOntologyClass).ontology_class.label;
    case 'timestamp':
      return <span>{(element as TimeElementTimestamp).timestamp}</span>;
    case 'interval':
      return <TimeIntervalDisplay timeInterval={(element as TimeElementInterval).interval} />;
    default:
      return EM_DASH;
  }
};

const TimeElementDisplay = memo(({ element }: { element?: TimeElement }) => {
  if (!element) {
    return EM_DASH;
  }

  const [timeType, label] = getTimeElementTypeLabel(element);

  if (!timeType) {
    // Unexpected TimeElement type
    console.error('Bad time element:', element);
    return EM_DASH;
  }

  return (
    <span>
      <strong>{label}: </strong>
      <InnerTimeElement type={timeType} element={element} />
    </span>
  );
});

TimeElementDisplay.displayName = 'TimeElementDisplay';

export default TimeElementDisplay;
