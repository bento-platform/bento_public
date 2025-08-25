// TODO: if lodash gets included in the future, replace this with _.range
export const range = (x: number) => [...Array(x).keys()];

export type WithId<T> = T & { id: string };

export const addId = <T>(items: T[]): WithId<T>[] =>
  items.map((item, index) => ({
    ...item,
    id: `${index}`,
  }));
