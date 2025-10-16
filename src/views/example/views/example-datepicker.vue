<script setup lang="ts">
import { DateUtils } from '@#/index'
import { DatePicker } from '@/components/modules/date-picker'
import { COMMON_PRESET_RANGES } from '@/components/modules/date-picker/utils/constants'
import type { DateValue } from '@/components/modules/date-picker/utils/types'
import { computed, ref } from 'vue'

// 单选/范围/不同模式：统一使用 DateValue 以兼容组件的 emits 类型
const dateSingleBasic = ref<DateValue>(null)
const dateSingleLimited = ref<DateValue>(null)
const dateSingleControlled = ref<DateValue>(null)
const dateRange = ref<DateValue>(null)
const dateTime = ref<DateValue>(null)
const timeOnly = ref<DateValue>(null)
const monthOnly = ref<DateValue>(null)
const yearOnly = ref<DateValue>(null)
const weekOnly = ref<DateValue>(null)
const quarterOnly = ref<DateValue>(null)

// 不同 valueFormat 示例（同样使用 DateValue 以避免类型冲突）
const tsValue = ref<DateValue>(null)
const isoValue = ref<DateValue>(null)

// 限制范围（示例：最近 30 天内）
const minDateVal: Date = (() => {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  d.setHours(0, 0, 0, 0)
  return d
})()
const maxDateVal: Date = (() => {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d
})()

// 预设范围
const presets = [
  COMMON_PRESET_RANGES.today,
  COMMON_PRESET_RANGES.last7Days,
  COMMON_PRESET_RANGES.last30Days,
]

// 引用组件方法（open/close/clear）
const dpRef = ref<{ open: () => void; close: () => void; clear: () => void } | null>(null)
const openPanel = () => dpRef.value?.open?.()
const closePanel = () => dpRef.value?.close?.()
const clearValue = () => dpRef.value?.clear?.()

// 其他功能示例
const disabledExample = ref<DateValue>(null)
const customClassExample = ref<DateValue>(null)
const customStyleExample = ref<DateValue>(null)
const placementExample = ref<DateValue>(null)
const localeTextsExample = ref<DateValue>(null)
const inlineExample = ref<DateValue>(null)
const sizeExample = ref<DateValue>(null)
const displayFormatExample = ref<DateValue>(null)

// 本地化日期格式示例
const localizedDateExample = ref<DateValue>(null)
const localizedDateTimeExample = ref<DateValue>(null)
const localizedTimeExample = ref<DateValue>(null)
const localizedRangeExample = ref<DateValue>(null)

// 计算本地化显示格式
const localizedDisplayFormat = computed(() => {
  const currentLocale = DateUtils.getCurrentLocale()
  switch (currentLocale) {
    case 'zh-CN':
      return 'yyyy年MM月dd日'
    case 'zh-TW':
      return 'yyyy年MM月dd日'
    case 'en-US':
    default:
      return 'MM/dd/yyyy'
  }
})

const localizedDateTimeFormat = computed(() => {
  const currentLocale = DateUtils.getCurrentLocale()
  switch (currentLocale) {
    case 'zh-CN':
      return 'yyyy年MM月dd日 HH:mm:ss'
    case 'zh-TW':
      return 'yyyy年MM月dd日 HH:mm:ss'
    case 'en-US':
    default:
      return 'MM/dd/yyyy HH:mm:ss'
  }
})

const localizedTimeFormat = computed(() => {
  const currentLocale = DateUtils.getCurrentLocale()
  switch (currentLocale) {
    case 'zh-CN':
      return 'HH时mm分ss秒'
    case 'zh-TW':
      return 'HH時mm分ss秒'
    case 'en-US':
    default:
      return 'HH:mm:ss'
  }
})

// 格式化选中的日期为本地化格式
const formatLocalizedDate = (date: DateValue) => {
  if (!date) {
    return '未选择'
  }
  const parsedDate = DateUtils.safeParse(date as Date)
  if (!parsedDate) {
    return '无效日期'
  }
  return DateUtils.format(parsedDate, localizedDisplayFormat.value)
}

const formatLocalizedDateTime = (date: DateValue) => {
  if (!date) {
    return '未选择'
  }
  const parsedDate = DateUtils.safeParse(date as Date)
  if (!parsedDate) {
    return '无效日期'
  }
  return DateUtils.format(parsedDate, localizedDateTimeFormat.value)
}

const formatLocalizedTime = (date: DateValue) => {
  if (!date) {
    return '未选择'
  }
  const parsedDate = DateUtils.safeParse(date as Date)
  if (!parsedDate) {
    return '无效日期'
  }
  return DateUtils.format(parsedDate, localizedTimeFormat.value)
}

const formatLocalizedRange = (range: DateValue) => {
  if (!range || !Array.isArray(range) || range.length !== 2) {
    return '未选择范围'
  }
  const [start, end] = range as [Date, Date]
  const startDate = DateUtils.safeParse(start)
  const endDate = DateUtils.safeParse(end)
  if (!startDate || !endDate) {
    return '无效日期范围'
  }
  return `${DateUtils.format(startDate, localizedDisplayFormat.value)} - ${DateUtils.format(endDate, localizedDisplayFormat.value)}`
}
</script>
<template lang="pug">
.between-col.p-padding.gap-gap
  .c-card.between-col.gap-gap
    h3.mb-gap 单选（Date）
    .grid.gap-gap.grid-cols-2
      DatePicker(v-model='dateSingleBasic', mode='date', value-format='iso')
    .fs-appFontSizes 当前值： {{ String(dateSingleBasic) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 范围选择（Date[]）
    .grid.gap-gap.grid-cols-2
      DatePicker(v-model='dateRange', :range='true', :presets='presets', value-format='iso')
    .fs-appFontSizes 当前值： {{ JSON.stringify(dateRange) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 不同模式
    .grid.gap-gap.grid-cols-2
      //- 日期时间
      DatePicker(v-model='dateTime', mode='datetime', :enable-seconds='true', value-format='iso')
      //- 仅时间
      DatePicker(
        v-model='timeOnly',
        mode='time',
        :enable-seconds='false',
        :is-24='true',
        value-format='iso'
      )
      //- 月份
      DatePicker(v-model='monthOnly', mode='month', value-format='iso')
      //- 年份
      DatePicker(v-model='yearOnly', mode='year')
      //- 周
      DatePicker(v-model='weekOnly', mode='week')
      //- 季度（以月份面板近似）
      DatePicker(v-model='quarterOnly', mode='quarter', value-format='iso')

  .c-card.between-col.gap-gap
    h3.mb-gap 不同值格式（valueFormat）
    .grid.gap-gap.grid-cols-2
      //- 时间戳
      DatePicker(
        v-model='tsValue',
        mode='datetime',
        value-format='timestamp',
        :enable-seconds='true'
      )
      //- ISO 字符串
      DatePicker(v-model='isoValue', mode='datetime', value-format='iso', :enable-seconds='true')
    .fs-appFontSizes 时间戳： {{ String(tsValue) }}
    .fs-appFontSizes ISO： {{ String(isoValue) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 最小/最大日期限制（最近30天）
    .grid.gap-gap.grid-cols-2
      DatePicker(
        v-model='dateSingleLimited',
        mode='date',
        :min-date='minDateVal',
        :max-date='maxDateVal',
        value-format='iso'
      )

  .c-card.between-col.gap-gap
    h3.mb-gap 调用组件方法
    .flex.items-center.gap-gap.mb-gap
      Button(outlined, severity='primary', @click='openPanel') 打开
      Button(outlined, severity='secondary', @click='closePanel') 关闭
      Button(outlined, severity='warning', @click='clearValue') 清空
    DatePicker(ref='dpRef', v-model='dateSingleControlled', mode='date', value-format='iso')

  .c-card.between-col.gap-gap
    h3.mb-gap 禁用状态
    .grid.gap-gap.grid-cols-2
      DatePicker(v-model='disabledExample', mode='date', :disabled='true', value-format='iso')
    .fs-appFontSizes 当前值： {{ String(disabledExample) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 自定义样式和类名
    .grid.gap-gap.grid-cols-2
      DatePicker(
        v-model='customClassExample',
        mode='date',
        custom-class='custom-datepicker',
        value-format='iso'
      )
      DatePicker(
        v-model='customStyleExample',
        mode='date',
        :input-style='{ width: "200px", border: "2px solid #007bff" }',
        value-format='iso'
      )
    .fs-appFontSizes 自定义类名： {{ String(customClassExample) }}
    .fs-appFontSizes 自定义样式： {{ String(customStyleExample) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 弹层定位
    .grid.gap-gap.grid-cols-2
      DatePicker(
        v-model='placementExample',
        mode='date',
        placement='top-start',
        value-format='iso'
      )
    .fs-appFontSizes 当前值： {{ String(placementExample) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 自定义文案
    .grid.gap-gap.grid-cols-2
      DatePicker(
        v-model='localeTextsExample',
        mode='date',
        :locale-texts='{ placeholder: "自定义占位符", clearLabel: "清除" }',
        value-format='iso'
      )
    .fs-appFontSizes 当前值： {{ String(localeTextsExample) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 内联模式
    .grid.gap-gap.grid-cols-1
      DatePicker(v-model='inlineExample', mode='date', :inline='true', value-format='iso')
    .fs-appFontSizes 当前值： {{ String(inlineExample) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 不同尺寸
    .grid.gap-gap.grid-cols-3
      DatePicker(v-model='sizeExample', mode='date', size='small', value-format='iso')
      DatePicker(v-model='sizeExample', mode='date', size='medium', value-format='iso')
      DatePicker(v-model='sizeExample', mode='date', size='large', value-format='iso')
    .fs-appFontSizes 当前值： {{ String(sizeExample) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 自定义显示格式
    .grid.gap-gap.grid-cols-2
      DatePicker(
        v-model='displayFormatExample',
        mode='datetime',
        display-format='yyyy年MM月dd日 HH:mm:ss',
        value-format='iso'
      )
    .fs-appFontSizes 当前值： {{ String(displayFormatExample) }}

  .c-card.between-col.gap-gap
    h3.mb-gap 本地化日期格式
    .fs-appFontSizes.mb-gap.color-accent100
      | 根据当前语言自动显示对应的日期格式
      br
      | 当前语言：{{ DateUtils.getCurrentLocale() }}
    .grid.gap-gap.grid-cols-2
      //- 本地化日期格式
      DatePicker(
        v-model='localizedDateExample',
        mode='date',
        :display-format='localizedDisplayFormat',
        value-format='iso'
      )
      //- 本地化日期时间格式
      DatePicker(
        v-model='localizedDateTimeExample',
        mode='datetime',
        :display-format='localizedDateTimeFormat',
        value-format='iso'
      )
      //- 本地化时间格式
      DatePicker(
        v-model='localizedTimeExample',
        mode='time',
        :display-format='localizedTimeFormat',
        value-format='iso'
      )
      //- 本地化范围格式
      DatePicker(
        v-model='localizedRangeExample',
        :range='true',
        mode='date',
        :display-format='localizedDisplayFormat',
        value-format='iso'
      )
    .fs-appFontSizes
      | 日期格式：{{ formatLocalizedDate(localizedDateExample) }}
    .fs-appFontSizes.mt-gaps
      | 日期时间格式：{{ formatLocalizedDateTime(localizedDateTimeExample) }}
    .fs-appFontSizes.mt-gaps
      | 时间格式：{{ formatLocalizedTime(localizedTimeExample) }}
    .fs-appFontSizes.mt-gaps
      | 范围格式：{{ formatLocalizedRange(localizedRangeExample) }}
</template>
