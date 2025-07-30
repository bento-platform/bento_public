import type { WithVisible } from '@/types/util';

export const addVisibilityProperty = <T>(r: T[], visibilityFunc: (r: T) => boolean): WithVisible<T>[] =>
  r.map((item) => ({
    ...item,
    isVisible: visibilityFunc(item),
  }));
