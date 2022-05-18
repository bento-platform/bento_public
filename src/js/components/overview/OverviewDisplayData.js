import React from 'react';
import BentoBarChart from './charts/BentoBarChart';
import BentoPie from './charts/BentoPie';
import { Col } from 'react-bootstrap';

const CHART_HEIGHT = 300;

const OverviewDisplayData = ({ all_charts, queryParameterStack }) => {
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

    Object.keys(inputData).forEach((_key) => {
      const attemptedDate = new Date(_key);
      const monthStr = attemptedDate.yyyydashmm();

      // if not a valid date, add to "missing"
      if (isNaN(attemptedDate.valueOf())) {
        monthlybins.missing = (monthlybins.missing ?? 0) + inputData[_key];
        return; // ie, continue
      }

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

  const parseDataGeneral = (
    inputData,
    leftTaper,
    rightTaper,
    binSize,
    field
  ) => {
    let formattedData = [];
    let taperLeft, taperRight;

    Object.keys(inputData).forEach((key, index, arr) => {
      const intKey = parseInt(key);
      if (intKey != NaN && field.type == 'number') {
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

    if (taperLeft != undefined) {
      // prepend left taper
      formattedData.unshift(taperLeft);
    }

    if (taperRight != undefined) {
      // append right taper
      formattedData.push(taperRight);
    }

    return formattedData;
  };

  const binMissingData = (data) => {
    const missingObject = data.filter((obj) => obj.x === 'missing');

    if (missingObject.length > 0) {
      // fancy one liner to splice the object out and re-append it
      data.push(data.splice(data.indexOf(missingObject[0]), 1)[0]);
    }
    return data;
  };

  return (
    <>
      {
        // iterate over all key-value pairs
        Object.entries(all_charts)
          // .map returns an array containing all items returned
          // from each function call (i.e, an array of pie charts)
          .map((item) => {
            const name = item[0];
            const inputData = item[1];

            const field = queryParameterStack.find(
              (e) => e.hasOwnProperty('key') && e.key == name
            )?.props?.Item;
            if (!field) {
              return null;
            }

            const title = field.title ?? '-';
            const type = field.type ?? '-';
            const chart = field.chart ?? '-';
            const units = field.units ?? undefined;
            const categoryOrdering = field.enum;

            let formattedData = [];

            // accumulate all pie chart data-points
            let leftTaper = field.taper_left || 0;
            let rightTaper = field.taper_right || 0;
            let binSize = field.bin_size || 0;

            if (field.type == 'string' && field.format == 'date') {
              formattedData = parseDateData(inputData);
            } else {
              formattedData = parseDataGeneral(
                inputData,
                leftTaper,
                rightTaper,
                binSize,
                field
              );
            }

            // move 'missing' object to end of list
            formattedData = binMissingData(formattedData);

            // order categories according to config file, where applicable
            if (categoryOrdering) {
              formattedData = orderCategories(formattedData, categoryOrdering);
            }

            if (type === 'number' || chart === 'bar') {
              // return histogram
              return (
                <Col
                  key={name}
                  md={12}
                  lg={6}
                  xl={4}
                  style={{ height: '100%' }}
                >
                  <BentoBarChart
                    title={title}
                    data={formattedData}
                    units={units}
                    height={CHART_HEIGHT}
                  />
                </Col>
              );
            } else {
              // return pie chart
              return (
                <Col
                  key={name}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{ height: '100%' }}
                >
                  <BentoPie
                    title={title}
                    data={formattedData}
                    height={CHART_HEIGHT}
                  />
                </Col>
              );
            }
          })
      }
    </>
  );
};

export default OverviewDisplayData;
