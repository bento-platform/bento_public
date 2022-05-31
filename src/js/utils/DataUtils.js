const orderCategories = (data, ordering) =>
  data.sort((a, b) => {
    let aIndex = ordering.indexOf(a.x);
    let bIndex = ordering.indexOf(b.x);

    // send any categories not found to end of array
    if (aIndex < 0) {
      aIndex = Number.MAX_VALUE;
    }
    if (bIndex < 0) [(bIndex = Number.MAX_VALUE)];
    return aIndex - bIndex;
  });

const parseDateData = (inputData) => {
  const formattedData = [];
  const monthlybins = {};
  const options = {
    year: 'numeric',
    month: 'short',
  };

  Object.keys(inputData).forEach((_key) => {
    const attemptedDate = new Date(_key);

    // if not a valid date, add to "missing"
    if (isNaN(attemptedDate.valueOf())) {
      monthlybins.missing = (monthlybins.missing ?? 0) + inputData[_key];
      return; // ie, continue
    }

    const monthStr = attemptedDate.toLocaleDateString('en-US', options);

    // verify if monthly bin exists - add to dict if not
    if (monthlybins[monthStr] == undefined) {
      monthlybins[monthStr] = inputData[_key];
    } else {
      monthlybins[monthStr] = monthlybins[monthStr] + inputData[_key];
    }
  });

  Object.keys(monthlybins).forEach((_key) => {
    formattedData.push({ x: _key, y: monthlybins[_key] });
  });

  return formattedData;
};

const parseNumericalData = (inputData, leftTaper, rightTaper, binSize) => {
  let formattedData = [];
  let taperLeft, taperRight;

  Object.keys(inputData).forEach((key, index, arr) => {
    const intKey = parseInt(key);
    if (intKey != NaN) {
      if (intKey < leftTaper) {
        const tlkey = `< ${leftTaper}`;
        if (taperLeft == undefined) {
          taperLeft = { x: tlkey, y: inputData[key] };
        } else {
          taperLeft.y += inputData[key];
        }
      } else if (intKey >= rightTaper + binSize) {
        const trkey = `>= ${rightTaper + binSize}`;
        if (taperRight == undefined) {
          taperRight = { x: trkey, y: inputData[key] };
        } else {
          taperRight.y += inputData[key];
        }
      } else {
        // number range tag
        let xTag = '';
        const leftVal = key;
        // add rightVal if exists
        if (index + 1 < arr.length) {
          const rightVal = arr[index + 1];
          xTag = `${leftVal} - ${rightVal}`;
        } else {
          xTag = leftVal;
        }

        formattedData.push({ x: xTag, y: inputData[key] });
      }
    } else {
      formattedData.push({ x: key, y: inputData[key] });
    }
  });

  if (taperLeft) {
    // prepend left taper
    formattedData.unshift(taperLeft);
  }

  if (taperRight) {
    // append right taper
    formattedData.push(taperRight);
  }

  return formattedData;
};

const parseDataGeneral = (inputData) =>
  Object.keys(inputData).map((key) => ({ x: key, y: inputData[key] }));

export const binMissingData = (data) => {
  const missingObject = data.filter((obj) => obj.x === 'missing');

  if (missingObject.length > 0) {
    // fancy one liner to splice the object out and re-append it
    data.push(data.splice(data.indexOf(missingObject[0]), 1)[0]);
  }
  return data;
};

export const parseData = ({ data, properties: props }) => {
  const leftTaper = props.taper_left || 0;
  const rightTaper = props.taper_right || 0;
  const binSize = props.bin_size || 0;

  let formattedData = [];

  if (props.type === 'string' && props.format === 'date') {
    formattedData = parseDateData(data);
  } else if (props.type === 'numerical') {
    formattedData = parseNumericalData(data, leftTaper, rightTaper, binSize);
  } else {
    formattedData = parseDataGeneral(data);
  }

  // move 'missing' object to end of list
  formattedData = binMissingData(formattedData);

  // order categories according to config file, where applicable
  if (props.enum) {
    formattedData = orderCategories(formattedData, props.enum);
  }

  return formattedData;
};
