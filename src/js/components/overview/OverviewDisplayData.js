import React from 'react';
import BentoBarChart from './charts/BentoBarChart';
import BentoPie from './charts/BentoPie';
import { Col } from 'react-bootstrap';
import {
  orderCategories,
  parseDateData,
  parseNumericalData,
  parseDataGeneral,
  binMissingData,
} from '../../utils/DataUtils';

const CHART_HEIGHT = 300;

const OverviewDisplayData = ({ all_charts, queryParameterStack }) => {
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
            } else if (field.type == 'numerical') {
              formattedData = parseNumericalData(
                inputData,
                leftTaper,
                rightTaper,
                binSize
              );
            } else {
              formattedData = parseDataGeneral(inputData);
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
