import type { LayoutConfig } from './types'

/**
 * 默认布局配置
 */
export function getDefaultLayoutConfig(): LayoutConfig {
  return {
    cols: 0,
    gap: 16,
    labelAlign: 'left',
    labelPosition: 'left',
    labelWidth: '100px',
    showLabel: true,
  }
}
