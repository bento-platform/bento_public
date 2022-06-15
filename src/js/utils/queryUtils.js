import { queryTypes } from '../constants/queryConstants';

// cannot destructure enum as it is a keyword
export const determineQueryType = ({
  type,
  is_range,
  format,
  ...otherProps
}) => {
  if (type === 'string') {
    if (format === 'date') return queryTypes.DATE;
    else if (otherProps.enum) return queryTypes.SELECT;
    else return queryTypes.INPUT;
  } else if (type === 'number') {
    if (is_range) return queryTypes.RANGE;
    else return queryTypes.NUMBER_INPUT;
  } else {
    return queryTypes.INPUT;
  }
};

export const getRelatedFields = (
  type,
  { value, dateAfter, dateBefore, rangeMin, rangeMax }
) => {
  switch (type) {
    case queryTypes.DATE:
      return { dateAfter, dateBefore };
    case queryTypes.RANGE:
      return { rangeMin, rangeMax };
    default:
      return { value };
  }
};
