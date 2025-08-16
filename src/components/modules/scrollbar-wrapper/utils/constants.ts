import type { ColorScheme } from './types'

// 默认颜色方案
export const defaultColorScheme: Required<ColorScheme> = {
  thumbColor: 'var(--accent100)',
  thumbHoverColor: 'var(--accent100)',
  trackColor: 'transparent',
  thumbPlaceholderColor: 'transparent',
}

export const defaultProps = {
  direction: 'vertical' as const,
  thumbWidth: 0, // 0 表示使用动态计算
  autoHide: true,
  autoHideDelay: 800,
  autoExpand: true,
  fixedThumb: false,
  throttleType: 'debounce' as const,
  throttleWait: 333,
  simulateScroll: false,
  colorScheme: () => defaultColorScheme,
}
