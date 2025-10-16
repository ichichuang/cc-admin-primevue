<script setup lang="ts">
import { useThemeSwitch } from '@/hooks'
import { getCurrentLocale, t } from '@/locales'
import VueDatePicker from '@vuepic/vue-datepicker'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { formatModelValue, getDefaultDisplayFormat, toDate } from './utils/helper'
import type {
  DatePickerEmits,
  DatePickerMode,
  DatePickerProps,
  DateValue,
  PresetRange,
  UseDatePickerExpose,
} from './utils/types'

// 放宽模板类型校验，避免严格模板下对 ref/属性的限制
const datePickerComp: any = VueDatePicker

type Props = DatePickerProps

const props = withDefaults(defineProps<Props>(), {
  mode: 'date' as DatePickerMode,
  range: false,
  displayFormat: undefined,
  valueFormat: 'date',
  localeTexts: undefined,
  placeholder: undefined,
  disabled: false,
  clearable: true,
  is24: true,
  enableSeconds: false,
  minDate: undefined,
  maxDate: undefined,
  presets: () => [] as PresetRange[],
  inline: false,
  placement: 'bottom-start',
  inputStyle: () => ({}),
  customClass: '',
  size: 'medium',
})

const emit = defineEmits<DatePickerEmits>()

// 主题切换支持
const { isDark } = useThemeSwitch()

// 多语言支持
const currentLocale = ref(getCurrentLocale())

// 内部值：与 vue-datepicker 的 model-type 对齐（date | timestamp | format）
const innerValue = ref<any>(null)

// 标记是否正在内部更新，防止循环触发
const isInternalUpdate = ref(false)

// 有效展示格式（未传时随模式提供默认）；兼容 format 别名
const effectiveDisplayFormat = computed(() => {
  const alias = (props as unknown as Record<string, any>).format as string | undefined
  return props.displayFormat || alias || getDefaultDisplayFormat(props.mode)
})

// 根据初始 modelValue 智能推断输出类型（未显式指定时）
const inferredValueFormat = computed<'date' | 'timestamp' | 'iso' | 'string'>(() => {
  if (props.valueFormat) {
    return props.valueFormat
  }
  const v = props.modelValue as unknown

  // 处理 null/undefined
  if (v === null || v === undefined) {
    return 'date'
  }

  if (Array.isArray(v)) {
    // 取第一个非空值进行类型推断
    const first = v.find(item => item !== null && item !== undefined)
    if (!first) {
      return 'date'
    }
    if (typeof first === 'number') {
      return 'timestamp'
    }
    if (typeof first === 'string') {
      return 'string'
    }
    return 'date'
  }

  if (typeof v === 'number') {
    return 'timestamp'
  }
  if (typeof v === 'string') {
    return 'string'
  }
  return 'date'
})

// modelType 映射（控制内部组件输出格式）
const modelType = computed(() => {
  const vf = inferredValueFormat.value
  if (vf === 'timestamp') {
    return 'timestamp'
  }
  if (vf === 'date') {
    return 'date'
  }
  // 'iso' | 'string' 统一使用 format 输出
  return 'format'
})

// 选择器模式映射到 vue-datepicker 的特性开关
const isDateTime = computed(() => props.mode === 'datetime')
const isTimeOnly = computed(() => props.mode === 'time')
const isMonth = computed(() => props.mode === 'month')
const isYear = computed(() => props.mode === 'year')
const isWeek = computed(() => props.mode === 'week')
// quarter 暂无官方季度面板，用 monthPicker + 自定义格式近似
const isQuarter = computed(() => props.mode === 'quarter')

// placeholder 文案
const placeholderText = computed(() => {
  if (props.placeholder) {
    return props.placeholder
  }
  const text = props.localeTexts?.placeholder
  if (text) {
    return text
  }
  // 确保响应语言变化，通过监听 currentLocale 来触发重新计算
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentLocaleValue = currentLocale.value // 添加依赖，确保语言变化时重新计算

  // 根据不同的 mode 和 range 显示相应的 placeholder
  // 兼容语言包未提供 `range-date`，统一映射为 `range`
  const modeKey = props.range
    ? props.mode === 'date'
      ? 'range'
      : `range-${props.mode}`
    : props.mode
  const specificPlaceholder = t(`components.datePicker.placeholders.${modeKey}`)

  if (
    specificPlaceholder &&
    specificPlaceholder !== `components.datePicker.placeholders.${modeKey}`
  ) {
    return specificPlaceholder
  }

  // 回退到通用 placeholder
  return props.range
    ? t('components.datePicker.rangePlaceholder') || '选择时间范围'
    : t('components.datePicker.placeholder') || '选择时间'
})

// 预设范围格式转换为 vue-datepicker 的 preset-dates
const presetDates = computed(() => {
  if (!props.presets || props.presets.length === 0) {
    return []
  }
  return props.presets
    .map(p => {
      const startRaw = typeof p.start === 'function' ? p.start() : p.start
      const endRaw = typeof p.end === 'function' ? p.end() : p.end
      const start = toDate(startRaw)
      const end = toDate(endRaw)

      // 验证预设值有效性
      if (!start || !end) {
        console.warn(`[DatePicker] Invalid preset range: ${p.label}`)
        return null
      }

      return {
        label: p.label,
        value: props.range ? [start, end] : start,
      }
    })
    .filter(Boolean) as Array<{ label: string; value: Date | [Date, Date] }>
})

// 将外部值规范化为与 modelType 一致的类型
const normalizeForModelType = (
  value: DateValue,
  vf: 'date' | 'timestamp' | 'iso' | 'string'
):
  | Date
  | number
  | string
  | null
  | [Date | number | string | null, Date | number | string | null] => {
  // 处理 null/undefined
  if (value === null || value === undefined) {
    return null
  }

  if (Array.isArray(value)) {
    const a = normalizeForModelType(value[0] as any, vf)
    const b = normalizeForModelType(value[1] as any, vf)
    return [a as any, b as any]
  }

  if (vf === 'date') {
    return toDate(value as any)
  }

  if (vf === 'timestamp') {
    if (typeof value === 'number') {
      return value
    }
    const d = toDate(value as any)
    return d ? d.getTime() : null
  }

  // 'iso' | 'string' 显示字符串，尽量返回合适格式
  if (typeof value === 'string') {
    return value
  }
  const d = toDate(value as any)
  return d ? d.toISOString() : null
}

// 比较两个值是否相等（深度比较）
const isValueEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true
  }
  if (a === null || b === null || a === undefined || b === undefined) {
    return false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }
    return a.every((item, index) => {
      const aTime = item instanceof Date ? item.getTime() : item
      const bTime = b[index] instanceof Date ? b[index].getTime() : b[index]
      return aTime === bTime
    })
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  return false
}

// 内部值变化 -> 派发给外部（按 valueFormat 输出）
const handleUpdate = (val: any) => {
  // 设置内部更新标志
  isInternalUpdate.value = true

  let out: DateValue
  if (Array.isArray(val)) {
    out = [
      formatModelValue(val[0], inferredValueFormat.value),
      formatModelValue(val[1], inferredValueFormat.value),
    ] as any
  } else {
    out = formatModelValue(val, inferredValueFormat.value) as any
  }

  emit('update:modelValue', out)
  emit('change', out)

  // 使用 nextTick 确保外部更新完成后再解除锁定
  nextTick(() => {
    isInternalUpdate.value = false
  })
}

// 外部值或推断格式变化 -> 同步内部值为正确类型
watch(
  [() => props.modelValue as DateValue, inferredValueFormat],
  ([next, vf]) => {
    // 跳过内部触发的更新
    if (isInternalUpdate.value) {
      return
    }

    // 若外部未提供值，则以当前时间作为默认值
    if (next === null || next === undefined) {
      const now = new Date()
      const internal = props.range
        ? [normalizeForModelType(now, vf), normalizeForModelType(now, vf)]
        : (normalizeForModelType(now, vf) as any)

      // 设置内部值并同步给外部
      innerValue.value = internal as any
      handleUpdate(internal)
      return
    }

    const normalized = normalizeForModelType(next, vf)

    // 只在值真正变化时更新，避免不必要的重渲染
    if (!isValueEqual(innerValue.value, normalized)) {
      innerValue.value = normalized
    }
  },
  { immediate: true, deep: true }
)

// 菜单打开事件
const handleOpen = () => {
  emit('open')
}

// 菜单关闭事件
const handleClose = () => {
  emit('close')
}

// 暴露方法
const dpRef = ref<any>(null)
const open = () => {
  dpRef.value?.openMenu?.()
}
const close = () => {
  dpRef.value?.closeMenu?.()
}
const clear = () => {
  dpRef.value?.clearValue?.()
}

defineExpose<UseDatePickerExpose>({ open, close, clear })

// 解析最小/最大日期为 Date | undefined，供组件直接使用
const minDateResolved = computed<Date | undefined>(() => {
  if (!props.minDate) {
    return undefined
  }
  const d = toDate(props.minDate as any)
  return d || undefined
})

const maxDateResolved = computed<Date | undefined>(() => {
  if (!props.maxDate) {
    return undefined
  }
  const d = toDate(props.maxDate as any)
  return d || undefined
})

// 首屏渲染稳定性：强制在 mounted 后刷新一次组件，避免某些环境初始不可交互
const renderKey = ref(0)
const isInitialized = ref(false)

// 主题模式计算属性
const themeMode = computed(() => (isDark.value ? 'dark' : 'light'))

// vue-datepicker 语言配置
const datePickerLocale = computed(() => {
  const locale = currentLocale.value
  switch (locale) {
    case 'zh-CN':
      return 'zh-CN'
    case 'zh-TW':
      return 'zh-TW'
    case 'en-US':
    default:
      return 'en'
  }
})

// 无障碍标签配置
const ariaLabels = computed(() => ({
  toggleOverlay: t('components.datePicker.selectDate'),
  menu: t('components.datePicker.selectDate'),
  input: t('components.datePicker.selectDate'),
  calendar: t('components.datePicker.selectDate'),
  clearInput: t('components.datePicker.clearLabel'),
  closeOverlay: t('components.datePicker.cancelLabel'),
  selectMonth: t('components.datePicker.selectDate'),
  selectYear: t('components.datePicker.selectDate'),
  selectTime: t('components.datePicker.selectTime'),
  selectDate: t('components.datePicker.selectDate'),
  previousMonth: t('components.datePicker.selectDate'),
  nextMonth: t('components.datePicker.selectDate'),
  previousYear: t('components.datePicker.selectDate'),
  nextYear: t('components.datePicker.selectDate'),
  previousDecade: t('components.datePicker.selectDate'),
  nextDecade: t('components.datePicker.selectDate'),
  previousCentury: t('components.datePicker.selectDate'),
  nextCentury: t('components.datePicker.selectDate'),
}))

// 监听语言变化
watch(
  () => getCurrentLocale(),
  newLocale => {
    currentLocale.value = newLocale
  }
)

onMounted(() => {
  nextTick(() => {
    renderKey.value += 1

    // 延迟初始化，确保所有样式和DOM完全就绪
    setTimeout(() => {
      // 1. 强制触发页面重绘
      window.dispatchEvent(new Event('resize'))

      // 2. 手动修复所有日期选择器元素
      const elements = document.querySelectorAll(
        '.dp__input_wrap, .dp__input, .dp__menu, .dp__menu_wrap'
      )
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.pointerEvents = 'auto'
          el.style.zIndex = '1000'
          el.style.cursor = 'pointer'
        }
      })

      // 3. 强制重新计算样式
      void document.body.offsetHeight

      // 4. 标记为已初始化
      isInitialized.value = true

      // 5. 再次触发重绘确保所有修复生效
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 50)
    }, 200)
  })
})
</script>

<template>
  <component
    :key="`${renderKey}-${isInitialized}-${themeMode}-${currentLocale}`"
    :is="datePickerComp"
    ref="dpRef"
    v-model="innerValue"
    :range="props.range"
    :format="modelType === 'format' ? effectiveDisplayFormat : undefined"
    :model-type="modelType"
    :placeholder="placeholderText"
    :clearable="props.clearable"
    :disabled="props.disabled"
    :is-24="props.is24"
    :enable-seconds="props.enableSeconds"
    :min-date="minDateResolved"
    :max-date="maxDateResolved"
    :preset-dates="presetDates"
    :inline="props.inline"
    :teleport="false"
    :dark="isDark"
    :locale="datePickerLocale"
    :aria-labels="ariaLabels"
    :class="[props.customClass, { 'dp-initialized': isInitialized }]"
    :style="props.inputStyle"
    :enable-time-picker="isDateTime"
    :time-picker="isTimeOnly"
    :month-picker="isMonth || isQuarter"
    :year-picker="isYear"
    :week-picker="isWeek"
    :text-input="false"
    :auto-apply="true"
    @update:model-value="handleUpdate"
    @open="handleOpen"
    @closed="handleClose"
  />
</template>
