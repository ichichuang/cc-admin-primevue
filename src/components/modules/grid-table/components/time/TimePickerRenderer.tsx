import { DateUtils } from '@#/index'
import type { ICellRendererParams } from 'ag-grid-community'
import { defineComponent } from 'vue'
import { GRID_TABLE_DEFAULT_CONFIG } from '../../utils/constants'

export default defineComponent({
  name: 'TimePickerRenderer',
  props: {
    params: {
      type: Object as () => ICellRendererParams,
      required: true,
    },
  },
  setup(props) {
    // 时间值格式化函数 - 转换为显示用的字符串
    const formatTimeForDisplay = (value: unknown): string => {
      const FORMAT = 'HH:mm'
      if (value === undefined || value === null || value === '') {
        return ''
      }

      // Date 实例 → 时间戳 → 统一格式化
      if (value instanceof Date && !isNaN(value.getTime())) {
        return DateUtils.formatTimestamp(value.getTime(), FORMAT)
      }

      // 数字（可能是秒/毫秒）→ 统一格式化（内部自动识别）
      if (typeof value === 'number' && !Number.isNaN(value)) {
        return DateUtils.formatTimestamp(value, FORMAT)
      }

      // 字符串：先转时间戳，再格式化
      if (typeof value === 'string') {
        const raw = value.trim()
        if (!raw) {
          return ''
        }

        let timestampMs: number | null = null

        if (/^\d+$/.test(raw)) {
          // 纯数字字符串
          if (raw.length === 10) {
            // 秒
            timestampMs = Number(raw) * 1000
          } else if (raw.length === 13) {
            // 毫秒
            timestampMs = Number(raw)
          } else if (raw.length === 14) {
            // 业务时间戳 YYYYMMDDHHmmss
            const y = Number(raw.slice(0, 4))
            const m = Number(raw.slice(4, 6))
            const d = Number(raw.slice(6, 8))
            const hh = Number(raw.slice(8, 10))
            const mm = Number(raw.slice(10, 12))
            const ss = Number(raw.slice(12, 14))
            timestampMs = new Date(y, m - 1, d, hh, mm, ss).getTime()
          } else {
            const num = Number(raw)
            if (!Number.isNaN(num)) {
              timestampMs = Math.abs(num) < 1_000_000_000_000 ? num * 1000 : num
            }
          }
        } else {
          // 非纯数字字符串，尝试 Date 解析
          const parsed = new Date(raw).getTime()
          if (!isNaN(parsed)) {
            timestampMs = parsed
          }
        }

        return timestampMs !== null ? DateUtils.formatTimestamp(timestampMs, FORMAT) : ''
      }

      return ''
    }

    // 获取列的对齐方式
    const getTextAlignStyle = (): { textAlign: 'left' | 'center' | 'right' } => {
      if (!props.params.colDef) {
        const defaultTextAlign =
          (GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.textAlign as 'left' | 'center' | 'right') ||
          'center'
        return { textAlign: defaultTextAlign }
      }

      const layout = props.params.colDef.context?.layout || {}
      if (layout.textAlign) {
        switch (layout.textAlign) {
          case 'left':
          case 'center':
          case 'right':
            return { textAlign: layout.textAlign }
          default:
            return { textAlign: 'left' }
        }
      }

      const textAlign = props.params.colDef.headerClass || props.params.colDef.cellClass
      if (textAlign && typeof textAlign === 'string') {
        if (textAlign.includes('left')) {
          return { textAlign: 'left' }
        }
        if (textAlign.includes('center')) {
          return { textAlign: 'center' }
        }
        if (textAlign.includes('right')) {
          return { textAlign: 'right' }
        }
      }

      const defaultTextAlign =
        (GRID_TABLE_DEFAULT_CONFIG.layout?.layout?.textAlign as 'left' | 'center' | 'right') ||
        'center'
      return { textAlign: defaultTextAlign }
    }

    const textAlignStyle = getTextAlignStyle()
    const displayValue = formatTimeForDisplay(props.params.value)

    return () => (
      <div
        class="full"
        style={textAlignStyle}
      >
        {displayValue}
      </div>
    )
  },
})
