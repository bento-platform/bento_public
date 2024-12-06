/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LocalStorageData, Sections } from '@/types/data';
import type { ValueOf } from '@/types/util';

export const verifyData = (nObj: any, oObj: LocalStorageData) => {
  const verifyCharts = (nCharts: any, oCharts: ValueOf<LocalStorageData>) => {
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
  const temp: LocalStorageData = {};
  sections.forEach(({ index, charts }) => {
    temp[index] = charts.map(({ id, isDisplayed, width }) => ({ id, isDisplayed, width }));
  });
  return temp;
};
