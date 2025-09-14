import ToggleSwitch from 'primevue/toggleswitch'
import { defineComponent, ref } from 'vue'
import { GRID_TABLE_DEFAULT_CONFIG } from '../../utils/constants'

export default defineComponent({
  name: 'ToggleSwitchEditor',
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const currentValue = ref(props.params.value || false)

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
            return { textAlign: 'center' } // 开关组件默认居中
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

    // AG Grid 编辑器必需的方法
    const getValue = () => {
      return currentValue.value
    }

    // 开关值更新处理
    const handleValueChange = (value: boolean) => {
      currentValue.value = value

      // 开关组件立即结束编辑状态
      setTimeout(() => {
        props.params.api.stopEditing()
      }, 100)
    }

    return {
      getValue,
      currentValue,
      textAlignStyle,
      handleValueChange,
    }
  },
  render() {
    return (
      <div
        class="center full"
        style={this.textAlignStyle}
      >
        <ToggleSwitch
          modelValue={this.currentValue}
          {...({
            onUpdateModelValue: (value: boolean) => {
              this.handleValueChange(value)
            },
            class: 'w-full p-0 border-none bg-tm rounded-none',
          } as any)}
        />
      </div>
    )
  },
})
