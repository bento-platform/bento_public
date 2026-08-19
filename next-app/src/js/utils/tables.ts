import type { VisibilityFn, WithVisible } from '@/types/util';

export function addVisibilityProperty<T>(items: T[], visibilityFn: VisibilityFn<T>): WithVisible<T>[] {
  return items.map((item) => ({ ...item, isVisible: visibilityFn(item) }));
}
