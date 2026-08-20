import type { HexColor } from 'bento-charts';

// Status chart colours (insights donut) — kept as hex: used as SVG stroke attributes
export const STATUS_CHART_COLORS: Record<string, HexColor> = {
  ONGOING: '#52C41A',
  COMPLETED: '#1677FF',
  UNASSIGNED: '#8C8C8C',
};

// Chart defaults
export const COLOR_CHART_FALLBACK = '#8C8C8C'; // SVG stroke — cannot use CSS var

// PCGL banner overlay
export const BANNER_GRADIENT = 'var(--cat-banner-gradient)';
