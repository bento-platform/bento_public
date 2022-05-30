// cannot destructure enum as it is a keyword
export const determineQueryType = ({
  type,
  is_range,
  format,
  ...otherProps
}) => {
  if (type === 'string') {
    if (format === 'date') return 'date';
    else if (otherProps.enum) return 'select';
    else return 'input';
  } else if (type === 'number') {
    if (is_range) return 'range';
    else return 'numberInput';
  } else return 'input';
};
