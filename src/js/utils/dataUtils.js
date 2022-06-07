const orderCategories = (data, ordering) => {
  const sequenceMap = {};
  ordering.forEach((el, i) => {
    sequenceMap[el.toLowerCase()] = i;
  });
  const getIndex = (el) => sequenceMap[el.toLowerCase()] ?? Number.MAX_VALUE;
  return data.sort((a, b) => getIndex(a.x) - getIndex(b.x));
};

const parseDateData = (inputData) => {
  const formattedData = [];
  const monthlybins = {};
  const options = {
    year: 'numeric',
    month: 'short',
  };

  Object.entries(inputData).forEach(([key, value]) => {
    const attemptedDate = new Date(key);

    // if not a valid date, add to "missing"
    if (isNaN(attemptedDate.valueOf())) {
      monthlybins.missing = (monthlybins.missing ?? 0) + value;
      return; // ie, continue
    }

    const monthStr = attemptedDate.toLocaleDateString('en-US', options);

    // verify if monthly bin exists - add to dict if not
    if (monthlybins[monthStr] == undefined) {
      monthlybins[monthStr] = value;
    } else {
      monthlybins[monthStr] = monthlybins[monthStr] + value;
    }
  });

  Object.entries(monthlybins).forEach(([key, value]) => {
    formattedData.push({ x: key, y: value });
  });
  return formattedData;
};

const parseNumericalData = (inputData, leftTaper, rightTaper, binSize) => {
  let formattedData = [];
  let taperLeft, taperRight;

  Object.entries(inputData).forEach(([key, value], index, arr) => {
    const intKey = parseInt(key);
    if (!Number.isNaN(intKey)) {
      if (intKey < leftTaper) {
        const tlkey = `< ${leftTaper}`;
        if (taperLeft === undefined) {
          taperLeft = { x: tlkey, y: value };
        } else {
          taperLeft.y += value;
        }
      } else if (intKey >= rightTaper + binSize) {
        const trkey = `>= ${rightTaper + binSize}`;
        if (taperRight === undefined) {
          taperRight = { x: trkey, y: value };
        } else {
          taperRight.y += value;
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

        formattedData.push({ x: xTag, y: value });
      }
    } else {
      formattedData.push({ x: key, y: value });
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
  Object.entries(inputData).map(([key, value]) => ({ x: key, y: value }));

export const parseData = ({ data, properties: props }) => {
  const leftTaper = props.taper_left || 0;
  const rightTaper = props.taper_right || 0;
  const binSize = props.bin_size || 0;

  let formattedData = [];

  if (props.type === 'string' && props.format === 'date')
    formattedData = parseDateData(data);
  else if (props.type === 'numerical')
    formattedData = parseNumericalData(data, leftTaper, rightTaper, binSize);
  else formattedData = parseDataGeneral(data);

  // order categories according to config file, where applicable
  if (props.enum) formattedData = orderCategories(formattedData, props.enum);

  // move 'missing' object to end of list
  const missingIndex = formattedData.findIndex((e) => e.x === 'missing');
  if (missingIndex !== -1)
    formattedData.push(formattedData.splice(missingIndex, 1)[0]);

  return formattedData;
};
