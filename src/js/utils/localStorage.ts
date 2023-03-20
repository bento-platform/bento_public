import { LocalStorageData, Sections } from '@/types/Data.interface';
import { ValueOf } from '@/types/util.types';

export const verifyData = (nObj: any, oObj: LocalStorageData) => {
  const verifyCharts = (nCharts: any, oCharts: ValueOf<LocalStorageData>) => {
    if (nCharts.length !== oCharts.length) return false;

    const nChartsMap: { [key in string]: boolean } = {};
    for (const { id, isDisplayed } of nCharts) {
      if (id && typeof isDisplayed === 'boolean') nChartsMap[id] = true;
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

export const getValue = <T>(key: string, defaultVal: T, verifyFunc: (arg: any) => boolean) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultVal;
    }
    const unserializedState = JSON.parse(serializedState);
    if (!verifyFunc(unserializedState)) {
      return defaultVal;
    }

    return unserializedState as T;
  } catch (err) {
    return defaultVal;
  }
};

export const convertSequenceAndDisplayData = (sections: Sections) => {
  const temp: LocalStorageData = {};
  sections.forEach(({ sectionTitle, charts }) => {
    temp[sectionTitle] = charts.map(({ id, isDisplayed }) => ({ id, isDisplayed }));
  });
  return temp;
};
