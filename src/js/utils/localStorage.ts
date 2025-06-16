/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocalStorageChartData, Sections } from '@/types/data';
import type { ValueOf } from '@/types/util';

export const verifyData = (nObj: any, oObj: LocalStorageChartData) => {
  const verifyCharts = (nCharts: any, oCharts: ValueOf<LocalStorageChartData>) => {
    if (nCharts.length !== oCharts.length) return false;

    const nChartsMap: { [key in string]: boolean } = {};
    for (const { id, isDisplayed, width } of nCharts) {
      if (id && typeof isDisplayed === 'boolean' && typeof width === 'number') nChartsMap[id] = true;
      else return false;
    }
    return oCharts.every((e) => nChartsMap[e.id]);
  };

  if (Object.keys(oObj).length !== Object.keys(nObj).length) return false;
  return Object.entries(oObj).every(([key, charts]) => verifyCharts(nObj[key], charts));
};

export const saveValue = (key: string, value: any) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch {
    //ignore
  }
};

/**
 * Safely retrieves and parses a value of type `T` from `localStorage`.
 *
 * @template T
 * @param {string} key - The `localStorage` key under which the value is stored.
 * @param {T} defaultVal - The value to return if the key does not exist, parsing fails, or validation fails.
 * @param {(arg: any) => boolean} verifyFunc - A predicate that receives the parsed value and returns `true` if it’s valid.
 * @returns {T} The parsed and validated value from `localStorage`, or `defaultVal` otherwise.
 */
export const getValue = <T>(key: string, defaultVal: T, verifyFunc: (arg: any) => boolean): T => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultVal;
    }
    const deserializedState = JSON.parse(serializedState);
    if (!verifyFunc(deserializedState)) {
      return defaultVal;
    }

    return deserializedState as T;
  } catch (err) {
    console.log(err);
    console.log('Error retrieving state from localStorage');
    return defaultVal;
  }
};

export const convertSequenceAndDisplayData = (sections: Sections) => {
  const temp: LocalStorageChartData = {};
  sections.forEach(({ sectionTitle, charts }) => {
    temp[sectionTitle] = charts.map(({ id, isDisplayed, width }) => ({ id, isDisplayed, width }));
  });
  return temp;
};
