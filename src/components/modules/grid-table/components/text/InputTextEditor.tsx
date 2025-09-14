import InputText from 'primevue/inputtext'
import { defineComponent, nextTick, ref } from 'vue'
import { GRID_TABLE_DEFAULT_CONFIG } from '../../utils/constants'

export default defineComponent({
  name: 'InputTextEditor',
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const currentValue = ref(props.params.value || '')
    const inputRef = ref<HTMLInputElement | null>(null)
    const isEditing = ref(true)
    const shouldStopOnBlur = ref(true)

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

    // AG Grid 编辑器必需的方法
    const getValue = () => {
      return currentValue.value
    }

    // AG Grid 编辑器生命周期方法 - 当编辑开始时调用
    const afterGuiAttached = () => {
      // 确保输入框获得焦点
      nextTick(() => {
        if (inputRef.value) {
          const inputEl = (inputRef.value as any).$el || inputRef.value
          if (inputEl) {
            inputEl.focus()
            // 选中所有文本，方便用户直接输入替换
            setTimeout(() => {
              inputEl.select()
            }, 50)
          }
        }
      })
    }

    // AG Grid 编辑器生命周期方法 - 判断是否应该取消编辑
    const isCancelBeforeStart = () => {
      return false
    }

    // AG Grid 编辑器生命周期方法 - 判断是否应该取消编辑（在按键时）
    const isCancelAfterEnd = () => {
      return false
    }

    // 安全地停止编辑
    const safeStopEditing = (cancel = false) => {
      if (!isEditing.value) {
        return
      }

      isEditing.value = false
      shouldStopOnBlur.value = false // 防止重复调用

      // 使用 setTimeout 确保在当前事件循环结束后执行
      setTimeout(() => {
        try {
          if (props.params?.api?.stopEditing) {
            props.params.api.stopEditing(cancel)
          }
        } catch (error) {
          console.warn('Error stopping edit:', error)
        }
      }, 0)
    }

    // 键盘事件处理
    const handleKeydown = (event: KeyboardEvent) => {
      const { key } = event

      if (key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()
        safeStopEditing(false) // 确认编辑
      } else if (key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        safeStopEditing(true) // 取消编辑
      } else if (key === 'Tab') {
        // Tab键应该移动到下一个单元格，让AG Grid处理
        safeStopEditing(false)
        // 不阻止默认行为，让AG Grid处理Tab导航
      }
    }

    // 输入框值变化处理
    const handleInput = (event: Event) => {
      const input = event.target as HTMLInputElement
      currentValue.value = input.value
    }

    // 失去焦点处理 - 更保守的方式
    const handleBlur = (event: FocusEvent) => {
      // 检查焦点是否移动到了AG Grid外部
      const relatedTarget = event.relatedTarget as Element
      const gridContainer = inputRef.value?.closest('.ag-root-wrapper')

      if (!isEditing.value || !shouldStopOnBlur.value) {
        return
      }

      // 如果焦点移动到了其他地方（不是AG Grid内部），则停止编辑
      if (!relatedTarget || !gridContainer?.contains(relatedTarget)) {
        safeStopEditing(false)
      }
    }

    // 设置输入框引用
    const setInputRef = (el: any) => {
      // PrimeVue组件的真实DOM元素
      const realEl = el?.$el || el
      inputRef.value = realEl
    }

    // 暴露AG Grid需要的方法
    const agGridMethods = {
      getValue,
      afterGuiAttached,
      isCancelBeforeStart,
      isCancelAfterEnd,
    }

    return {
      ...agGridMethods,
      currentValue,
      textAlignStyle,
      handleKeydown,
      handleInput,
      handleBlur,
      setInputRef,
    }
  },
  render() {
    return (
      <div class="center full">
        <InputText
          ref={this.setInputRef}
          modelValue={this.currentValue}
          {...({
            onUpdateModelValue: (value: string) => {
              this.currentValue = value
            },
            onKeydown: this.handleKeydown,
            onInput: this.handleInput,
            onBlur: this.handleBlur,
            type: 'text',
            class: 'full p-0 border-none bg-tm rounded-none',
            style: this.textAlignStyle,
            autofocus: true,
          } as any)}
        />
      </div>
    )
  },
})
