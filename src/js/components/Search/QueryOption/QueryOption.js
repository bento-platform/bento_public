import React from 'react';
import DateOption from './DateOption';
import InputOption from './InputOption';
import NumberInputOption from './numberInputOption';
import NumberRange from './NumberRange';
import SelectOption from './SelectOption';

// return <NumberRange name={name} data={data} isChecked={isChecked} {...combined} />;

const QueryOption = ({ queryType, ...otherProps }) => {
  const renderOptionSwitch = () => {
    switch (queryType) {
      case 'numberInput':
        return <NumberInputOption {...otherProps} />;
      case 'range':
        return <NumberRange {...otherProps} />;
      case 'input':
        return <InputOption {...otherProps} />;
      case 'date':
        return <DateOption {...otherProps} />;
      case 'select':
        return <SelectOption {...otherProps} />;
      default:
        return <p>option type doesnt exist</p>;
    }
  };

  return <>{renderOptionSwitch()}</>;
};

export default QueryOption;
