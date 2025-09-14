import type { ICellRendererParams } from 'ag-grid-community'
import { defineComponent } from 'vue'
import { GRID_TABLE_DEFAULT_CONFIG } from '../../utils/constants'

export default defineComponent({
  name: 'DatePickerRenderer',
  props: {
    params: {
      type: Object as () => ICellRendererParams,
      required: true,
    },
  },
  setup(props) {
    // 日期值格式化函数 - 转换为显示用的字符串
    const formatDateForDisplay = (value: any): string => {
      if (!value) {
        return ''
      }
      if (value instanceof Date && !isNaN(value.getTime())) {
        return value.toISOString().split('T')[0] // YYYY-MM-DD 格式
      }
      if (typeof value === 'string') {
        const date = new Date(value)
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0]
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
    const displayValue = formatDateForDisplay(props.params.value)

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
