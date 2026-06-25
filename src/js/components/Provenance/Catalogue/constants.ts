// Status badge styles (card pill)
export const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Ongoing: {
    color: 'var(--cat-status-ongoing-color)',
    bg: 'var(--cat-status-ongoing-bg)',
    border: 'var(--cat-status-ongoing-border)',
  },
  Completed: { color: 'var(--ant-color-primary, #054A74)', bg: 'var(--ant-color-primary-bg, rgba(5, 74, 116, 0.10))', border: 'var(--cat-status-completed-border)' },
  Unassigned: { color: 'var(--text-muted)', bg: 'var(--cat-surface-subtle)', border: 'var(--border-base)' },
};

// Status chart colours (insights donut) — kept as hex: used as SVG stroke attributes
export const STATUS_CHART_COLORS: Record<string, string> = {
  Ongoing: '#52C41A',
  Completed: '#1677FF',
  Unassigned: '#8C8C8C',
};

// Chart defaults
export const COLOR_CHART_FALLBACK = '#8C8C8C'; // SVG stroke — cannot use CSS var
export const COLOR_BAR_DEFAULT = 'var(--antd-blue-5)';
export const COLOR_DONUT_TRACK = '#EEE'; // SVG stroke — cannot use CSS var

// PCGL banner overlay
export const BANNER_GRADIENT = 'var(--cat-banner-gradient)';
