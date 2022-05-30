import React from 'react';
import InputOption from './InputOption';
import NumberInputOption from './numberInputOption';
import NumberRange from './NumberRange';

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
      default:
        return <p>option type doesnt exist</p>;
    }
  };

  return <>{renderOptionSwitch()}</>;
};

export default QueryOption;
