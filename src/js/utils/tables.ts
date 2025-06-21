import type { WithVisible } from '@/types/util';

export const addVisibilityProperty = <T>(r: T[], visibilityFunc: (r: T) => boolean): WithVisible<T>[] => {
  return r.map((item) => ({
    ...item,
    isVisible: visibilityFunc(item),
  }));
};
