import { computed } from 'vue'
import type { LayoutConfig } from './types'
import { useSizeStore } from '@/stores'
const sizeStore = useSizeStore()
const gap = computed(() => sizeStore.getGap)
/**
 * 默认布局配置
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  cols: 0,
  gap: gap.value < 16 ? 16 : gap.value,
  labelAlign: 'left',
  labelPosition: 'left',
  labelWidth: '100px',
  showLabel: true,
}
