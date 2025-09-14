import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import { GRID_TABLE_DEFAULT_CONFIG } from '../../utils/constants'

export default defineComponent({
  name: 'DatePickerEditor',
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const datePickerRef = ref<any>(null)
    const inputTextRef = ref<any>(null)
    const isEditing = ref(true)
    const shouldStopOnBlur = ref(true)
    const isDatePickerVisible = ref(false)
    const hasSelectedDate = ref(false)
    const isInitializing = ref(true)

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

    // 日期值解析函数 - 将字符串转换为 Date 对象
    const parseDateFromString = (dateString: string): Date | null => {
      if (!dateString) {
        return null
      }
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? null : date
    }

    const currentValue = ref(formatDateForDisplay(props.params.value))
    const currentDateValue = ref(parseDateFromString(formatDateForDisplay(props.params.value)))

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
      return currentDateValue.value
    }

    // 强制显示DatePicker面板 - 使用 PrimeVue 15 受控属性
    const showDatePicker = () => {
      isDatePickerVisible.value = true // 直接控制面板开关
    }

    // AG Grid 编辑器生命周期方法 - 当编辑开始时调用
    const afterGuiAttached = () => {
      isInitializing.value = true

      nextTick(() => {
        // 先聚焦到 InputText
        if (inputTextRef.value) {
          const inputEl = inputTextRef.value.$el || inputTextRef.value
          if (inputEl) {
            inputEl.focus()
            // 如果有初始值，选中所有文本
            if (currentValue.value) {
              setTimeout(() => {
                inputEl.select()
              }, 50)
            }
          }
        }

        // 延迟显示日历，给组件更多初始化时间
        nextTick(() => {
          setTimeout(() => {
            isInitializing.value = false
            showDatePicker()
          }, 50) // 使用 nextTick 确保组件已挂载
        })
      })
    }

    // AG Grid 编辑器生命周期方法
    const isCancelBeforeStart = () => false
    const isCancelAfterEnd = () => false

    // 安全地停止编辑
    const safeStopEditing = (cancel = false) => {
      if (!isEditing.value) {
        return
      }

      isEditing.value = false
      shouldStopOnBlur.value = false

      // 隐藏日历面板 - 使用 PrimeVue 15 受控属性
      isDatePickerVisible.value = false

      // 隐藏DatePicker元素
      const datePickerEl = datePickerRef.value?.$el
      if (datePickerEl) {
        datePickerEl.style.visibility = 'hidden'
        datePickerEl.style.pointerEvents = 'none'
      }

      // 延迟执行以避免DOM冲突
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
        safeStopEditing(false)
      } else if (key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        // 重置到原始值
        currentValue.value = formatDateForDisplay(props.params.value)
        currentDateValue.value = parseDateFromString(currentValue.value)
        safeStopEditing(true)
      } else if (key === 'Tab') {
        safeStopEditing(false)
        // 不阻止默认行为，让AG Grid处理Tab导航
      }
    }

    // 日期选择事件处理
    const handleDateSelect = (selectedDate: Date | null) => {
      currentDateValue.value = selectedDate
      currentValue.value = formatDateForDisplay(selectedDate)
      hasSelectedDate.value = true

      // 选择日期后立即停止编辑
      setTimeout(() => {
        if (isEditing.value) {
          safeStopEditing(false)
        }
      }, 100)
    }

    // InputText 焦点事件处理 - 显示日期选择器
    const handleInputFocus = (event: FocusEvent) => {
      // 防止初始化时重复触发
      if (isInitializing.value) {
        return
      }

      // 防止输入框获得真正的焦点，而是立即显示日期选择器
      event.preventDefault()

      if (!isDatePickerVisible.value) {
        showDatePicker()
      }
    }

    // InputText 点击事件处理
    const handleInputClick = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (!isDatePickerVisible.value) {
        showDatePicker()
      }
    }

    // InputText 值变化处理（手动输入）
    const handleInputChange = (value: string) => {
      currentValue.value = value

      // 尝试解析输入的日期字符串
      const parsedDate = parseDateFromString(value)
      if (parsedDate) {
        currentDateValue.value = parsedDate
      }
    }

    // 日历面板显示事件
    const handleShow = () => {
      isDatePickerVisible.value = true
      shouldStopOnBlur.value = false // 当面板显示时，暂时禁用blur停止编辑
    }

    // 日历面板隐藏事件
    const handleHide = () => {
      isDatePickerVisible.value = false

      // 如果用户没有选择日期，且面板被隐藏了，则停止编辑
      setTimeout(() => {
        if (!hasSelectedDate.value && isEditing.value) {
          shouldStopOnBlur.value = true
          safeStopEditing(false)
        }
      }, 100)
    }

    // 失去焦点处理
    const handleBlur = (event: FocusEvent) => {
      if (!isEditing.value || !shouldStopOnBlur.value) {
        return
      }

      // 如果日历面板还在显示，不要停止编辑
      if (isDatePickerVisible.value) {
        return
      }

      const relatedTarget = event.relatedTarget as Element

      // 检查焦点是否移动到了日历面板内
      const calendarPanel = document.querySelector('.p-datepicker-panel')
      if (calendarPanel && calendarPanel.contains(relatedTarget)) {
        return
      }

      // 检查是否移动到了DatePicker内部
      const datePickerEl = datePickerRef.value?.$el
      if (datePickerEl && datePickerEl.contains(relatedTarget)) {
        return
      }

      // 如果焦点移动到了AG Grid外部，则停止编辑
      const gridContainer =
        inputTextRef.value?.$el?.closest('.ag-root-wrapper') ||
        datePickerEl?.closest('.ag-root-wrapper')

      if (!relatedTarget || !gridContainer?.contains(relatedTarget)) {
        setTimeout(() => {
          safeStopEditing(false)
        }, 100)
      }
    }

    // 点击事件处理 - 防止点击时立即隐藏面板
    const handleClick = (event: MouseEvent) => {
      event.stopPropagation()
    }

    // 设置 DatePicker 引用
    const setDatePickerRef = (el: any) => {
      datePickerRef.value = el
    }

    // 设置 InputText 引用
    const setInputTextRef = (el: any) => {
      inputTextRef.value = el
    }

    onMounted(() => {
      // 组件挂载完成
    })

    return {
      getValue,
      afterGuiAttached,
      isCancelBeforeStart,
      isCancelAfterEnd,
      currentValue,
      currentDateValue,
      isDatePickerVisible,
      textAlignStyle,
      handleKeydown,
      handleDateSelect,
      handleInputFocus,
      handleInputClick,
      handleInputChange,
      handleBlur,
      handleShow,
      handleHide,
      handleClick,
      setDatePickerRef,
      setInputTextRef,
    }
  },
  render() {
    return (
      <div
        class="center full"
        onClick={this.handleClick}
      >
        {/* DatePicker - 使用 v-model:overlayVisible 控制面板显示 */}
        <DatePicker
          ref={this.setDatePickerRef}
          modelValue={this.currentDateValue}
          overlayVisible={this.isDatePickerVisible}
          {...({
            onUpdateModelValue: (value: Date | null) => {
              this.handleDateSelect(value)
            },
            onUpdateOverlayVisible: (visible: boolean) => {
              this.isDatePickerVisible = visible
            },
            onShow: this.handleShow,
            onHide: this.handleHide,
            onBlur: this.handleBlur,
            dateFormat: 'yy-mm-dd',
            manualInput: false,
            showIcon: false,
            autoZIndex: true,
            appendTo: 'body',
            style: {
              position: 'absolute',
              top: '-9999px',
              left: '-9999px',
              visibility: 'hidden',
              pointerEvents: 'none',
              width: '1px',
              height: '1px',
              opacity: 0,
            },
          } as any)}
        />

        {/* 可见的 InputText */}
        <InputText
          ref={this.setInputTextRef}
          modelValue={this.currentValue}
          {...({
            onUpdateModelValue: (value: string) => {
              this.handleInputChange(value)
            },
            onFocus: this.handleInputFocus,
            onClick: this.handleInputClick,
            onKeydown: this.handleKeydown,
            onBlur: this.handleBlur,
            type: 'text',
            placeholder: 'YYYY-MM-DD',
            readonly: true,
            class: 'full p-0 border-none bg-tm rounded-none cursor-pointer',
            style: this.textAlignStyle,
            autofocus: true,
          } as any)}
        />
      </div>
    )
  },
})
