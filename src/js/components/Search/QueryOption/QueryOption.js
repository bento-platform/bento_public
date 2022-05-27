import React from 'react';
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
      default:
        return <p>option type doesnt exist</p>;
    }
  };

  return <>{renderOptionSwitch()}</>;
};

export default QueryOption;
