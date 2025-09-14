import InputText from 'primevue/inputtext'
import { defineComponent, nextTick, ref } from 'vue'
import { GRID_TABLE_DEFAULT_CONFIG } from '../../utils/constants'

export default defineComponent({
  name: 'InputNumberEditor',
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const currentValue = ref(props.params.value?.toString() || '')
    const isComposing = ref(false)
    const inputRef = ref<HTMLInputElement | null>(null)

    // 数字验证和清理函数
    const cleanNumericValue = (value: string): string => {
      if (!value) {
        return ''
      }

      // 只保留数字、小数点和负号
      let cleaned = value.replace(/[^0-9.-]/g, '')

      // 处理负号：只允许在开头出现一次
      const negativeMatch = cleaned.match(/-/g)
      if (negativeMatch && negativeMatch.length > 0) {
        if (cleaned.indexOf('-') !== 0) {
          // 如果负号不在开头，移除所有负号
          cleaned = cleaned.replace(/-/g, '')
        } else {
          // 保留第一个负号，移除其余的
          cleaned = '-' + cleaned.substring(1).replace(/-/g, '')
        }
      }

      // 处理小数点：只允许一个
      const decimalSplit = cleaned.split('.')
      if (decimalSplit.length > 2) {
        cleaned = decimalSplit[0] + '.' + decimalSplit.slice(1).join('')
      }

      // 处理边界情况
      if (cleaned === '-') {
        return cleaned // 允许单独的负号
      }
      if (cleaned === '.') {
        return '0.' // 单独的点转换为0.
      }
      if (cleaned.startsWith('.')) {
        cleaned = '0' + cleaned // .123 -> 0.123
      }
      if (cleaned.startsWith('-.')) {
        cleaned = '-0' + cleaned.substring(1) // -.123 -> -0.123
      }

      return cleaned
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

    // AG Grid 编辑器必需的方法
    const getValue = () => {
      const numValue = parseFloat(currentValue.value) || 0
      return numValue
    }

    // 更新输入框值的安全方法
    const updateInputValue = (newValue: string, preserveCursor = true) => {
      if (!inputRef.value) {
        return
      }

      const input = inputRef.value
      const oldValue = input.value
      const cursorPos = preserveCursor ? input.selectionStart || 0 : newValue.length

      if (oldValue !== newValue) {
        const lengthDiff = newValue.length - oldValue.length
        const newCursorPos = Math.max(0, Math.min(cursorPos + lengthDiff, newValue.length))

        currentValue.value = newValue
        input.value = newValue

        // 使用nextTick确保DOM更新后设置光标位置
        nextTick(() => {
          if (input === document.activeElement) {
            input.setSelectionRange(newCursorPos, newCursorPos)
          }
        })
      }
    }

    // 键盘事件处理
    const handleKeydown = (event: KeyboardEvent) => {
      if (isComposing.value) {
        return
      }

      const { key, ctrlKey, metaKey } = event

      // 允许的控制键
      const controlKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'PageUp',
        'PageDown',
      ]

      // 允许的组合键
      if (ctrlKey || metaKey) {
        const allowedCombos = ['a', 'c', 'v', 'x', 'z']
        if (allowedCombos.includes(key.toLowerCase())) {
          return
        }
      }

      // 控制键处理
      if (controlKeys.includes(key)) {
        if (key === 'Enter') {
          props.params.api.stopEditing()
        } else if (key === 'Escape') {
          props.params.api.stopEditing(false)
        }
        return
      }

      const currentVal = currentValue.value
      const input = event.target as HTMLInputElement
      const selectionStart = input.selectionStart || 0
      const selectionEnd = input.selectionEnd || 0

      // 数字字符
      if (/^[0-9]$/.test(key)) {
        return // 允许数字
      }

      // 小数点
      if (key === '.') {
        // 如果已经有小数点，或者选择的文本包含小数点，则允许
        if (
          !currentVal.includes('.') ||
          (selectionStart < selectionEnd &&
            currentVal.substring(selectionStart, selectionEnd).includes('.'))
        ) {
          return
        }
      }

      // 负号
      if (key === '-') {
        // 只允许在开头输入，或者选择了开头的文本
        if (selectionStart === 0 && (!currentVal.includes('-') || selectionEnd > 0)) {
          return
        }
      }

      // 阻止其他所有字符
      event.preventDefault()
      event.stopPropagation()
    }

    // 输入事件处理
    const handleInput = (event: Event) => {
      if (isComposing.value) {
        return
      }

      const input = event.target as HTMLInputElement
      const newValue = cleanNumericValue(input.value)

      if (input.value !== newValue) {
        updateInputValue(newValue)
      } else {
        currentValue.value = newValue
      }
    }

    // 组合输入开始
    const handleCompositionStart = () => {
      isComposing.value = true
    }

    // 组合输入结束
    const handleCompositionEnd = (event: CompositionEvent) => {
      isComposing.value = false

      // 组合结束后清理值
      nextTick(() => {
        const input = event.target as HTMLInputElement
        const cleanedValue = cleanNumericValue(input.value)
        updateInputValue(cleanedValue, false) // 不保持光标位置
      })
    }

    // 粘贴事件处理
    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault()

      const clipboardData = event.clipboardData
      if (!clipboardData || !inputRef.value) {
        return
      }

      const pastedText = clipboardData.getData('text')
      const cleanedText = cleanNumericValue(pastedText)

      if (cleanedText) {
        const input = inputRef.value
        const start = input.selectionStart || 0
        const end = input.selectionEnd || 0
        const currentVal = currentValue.value

        const newValue = currentVal.slice(0, start) + cleanedText + currentVal.slice(end)
        const finalValue = cleanNumericValue(newValue)

        updateInputValue(finalValue, false)

        // 设置光标到粘贴内容末尾
        nextTick(() => {
          const newCursorPos = start + cleanedText.length
          input.setSelectionRange(newCursorPos, newCursorPos)
        })
      }
    }

    // 失去焦点时最终清理
    const handleBlur = () => {
      if (!inputRef.value) {
        return
      }

      const cleanedValue = cleanNumericValue(currentValue.value)
      if (cleanedValue !== currentValue.value) {
        updateInputValue(cleanedValue, false)
      }
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

    // AG Grid 编辑器生命周期方法
    const isCancelBeforeStart = () => false
    const isCancelAfterEnd = () => false

    // 设置输入框引用
    const setInputRef = (el: any) => {
      inputRef.value = el?.$el || el
    }

    return {
      getValue,
      afterGuiAttached,
      isCancelBeforeStart,
      isCancelAfterEnd,
      currentValue,
      textAlignStyle,
      handleKeydown,
      handleInput,
      handleCompositionStart,
      handleCompositionEnd,
      handlePaste,
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
            onCompositionstart: this.handleCompositionStart,
            onCompositionend: this.handleCompositionEnd,
            onPaste: this.handlePaste,
            onBlur: this.handleBlur,
            type: 'text',
            inputmode: 'decimal',
            class: 'full p-0 border-none bg-tm rounded-none',
            style: this.textAlignStyle,
            autofocus: true,
          } as any)}
        />
      </div>
    )
  },
})
