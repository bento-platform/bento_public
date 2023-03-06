import { RADIAN } from './chartConstants';

export const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => {
  return {
    x: cx + Math.cos(-RADIAN * angle) * radius,
    y: cy + Math.sin(-RADIAN * angle) * radius,
  };
};
