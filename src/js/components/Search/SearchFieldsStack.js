import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import QueryParameter from './QueryParameter';
import MakeQueryOption from './MakeQueryOption';

const SearchFieldsStack = () => {
  const params = useSelector((state) => state.query.queryableFields);

  const [checkedOptions, setCheckedOptions] = useState([]);

  const onCheckToggle = (name) => {
    const temp = [...checkedOptions];
    if (checkedOptions.includes(name)) {
      setCheckedOptions(temp.filter((e) => e !== name));
    } else {
      temp.push(name);
      setCheckedOptions(temp);
    }
  };

  //        <QueryParameter key={i} Item={e} />

  return (
    <>
      {params.map((e, i) => (
        <MakeQueryOption
          key={i}
          queryField={e}
          isChecked={checkedOptions.includes(e.name)}
          onCheckToggle={() => {
            onCheckToggle(e.name);
          }}
        />
      ))}
    </>
  );
};

export default SearchFieldsStack;
