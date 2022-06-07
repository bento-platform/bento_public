import React from 'react';
import { queryTypes } from '../../../constants/queryConstants';
import DateOption from './DateOption';
import InputOption from './InputOption';
import NumberInputOption from './NumberInputOption';
import NumberRange from './NumberRange';
import SelectOption from './SelectOption';

const QueryOption = ({ queryType, ...otherProps }) => {
  const renderOptionSwitch = () => {
    switch (queryType) {
      case queryTypes.NUMBER_INPUT:
        return <NumberInputOption {...otherProps} />;
      case queryTypes.RANGE:
        return <NumberRange {...otherProps} />;
      case queryTypes.INPUT:
        return <InputOption {...otherProps} />;
      case queryTypes.DATE:
        return <DateOption {...otherProps} />;
      case queryTypes.SELECT:
        return <SelectOption {...otherProps} />;
      default:
        return null;
    }
  };

  return <>{renderOptionSwitch()}</>;
};

export default QueryOption;
