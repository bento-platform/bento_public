import type { WithVisible } from '@/types/util';

export const addVisibilityProperty = <T>(r: T[], visibilityFunc: (r: T) => boolean): WithVisible<T>[] => {
  return r.map((item) => ({
    ...item,
    isVisible: visibilityFunc(item),
  }));
};

export const visibilitySelector = ({ isVisible }: WithVisible<unknown>) => !!isVisible;

export const visibilityReducer = <T>(r: WithVisible<T>[]): boolean => {
  return r.some(visibilitySelector);
};
