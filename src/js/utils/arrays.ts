// TODO: if lodash gets included in the future, replace this with _.range
export const range = (x: number) => [...Array(x).keys()];

export const addId = <T>(items: T[]): (T & { id: number })[] =>
  items.map((item, index) => ({
    ...item,
    id: index,
  }));

export type WithId<T> = T & { id: number };
