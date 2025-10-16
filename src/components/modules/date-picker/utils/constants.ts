// @/components/modules/date-picker/utils/constants.ts
/**
 * DatePicker 默认配置常量
 */

import type { DatePickerDefaults, DatePickerMode } from './types'

/**
 * 不同模式的默认展示格式（用于 UI 显示）
 *
 * 注意：这些格式需要与 @vuepic/vue-datepicker 的格式化规范兼容
 * @see https://vue3datepicker.com/props/formatting/
 */
export const defaultDisplayFormats: Record<DatePickerMode, string> = {
  date: 'yyyy-MM-dd', // 日期：2024-01-01
  datetime: 'yyyy-MM-dd HH:mm:ss', // 日期时间：2024-01-01 14:30:00
  time: 'HH:mm:ss', // 时间：14:30:00
  month: 'yyyy-MM', // 月份：2024-01
  year: 'yyyy', // 年份：2024
  week: "yyyy-'W'ww", // 周：2024-W01
  quarter: "yyyy-'Q'Q", // 季度：2024-Q1
}

/**
 * 不带秒的时间格式（常用场景）
 */
export const SIMPLE_TIME_FORMATS: Record<string, string> = {
  datetime: 'yyyy-MM-dd HH:mm',
  time: 'HH:mm',
}

/**
 * 中文格式（可选）
 */
export const CHINESE_FORMATS: Record<DatePickerMode, string> = {
  date: 'yyyy年MM月dd日',
  datetime: 'yyyy年MM月dd日 HH:mm:ss',
  time: 'HH:mm:ss',
  month: 'yyyy年MM月',
  year: 'yyyy年',
  week: "yyyy年'第'ww周",
  quarter: "yyyy年'第'Q季度",
}

/**
 * 美式格式（可选）
 */
export const US_FORMATS: Record<DatePickerMode, string> = {
  date: 'MM/dd/yyyy',
  datetime: 'MM/dd/yyyy hh:mm:ss a',
  time: 'hh:mm:ss a',
  month: 'MM/yyyy',
  year: 'yyyy',
  week: "yyyy-'W'ww",
  quarter: "yyyy-'Q'Q",
}

/**
 * ISO 8601 标准格式
 */
export const ISO_FORMATS: Record<DatePickerMode, string> = {
  date: 'yyyy-MM-dd',
  datetime: "yyyy-MM-dd'T'HH:mm:ss",
  time: 'HH:mm:ss',
  month: 'yyyy-MM',
  year: 'yyyy',
  week: "yyyy-'W'ww",
  quarter: "yyyy-'Q'Q",
}

/**
 * 组件默认配置
 */
export const DATE_PICKER_DEFAULTS: DatePickerDefaults = {
  defaultDisplayFormats,
}

/**
 * 快捷时间范围预设（常用场景）
 */
export const COMMON_PRESET_RANGES = {
  today: {
    label: '今天',
    start: () => {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return now
    },
    end: () => {
      const now = new Date()
      now.setHours(23, 59, 59, 999)
      return now
    },
  },
  yesterday: {
    label: '昨天',
    start: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      date.setHours(0, 0, 0, 0)
      return date
    },
    end: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      date.setHours(23, 59, 59, 999)
      return date
    },
  },
  last7Days: {
    label: '最近7天',
    start: () => {
      const date = new Date()
      date.setDate(date.getDate() - 6)
      date.setHours(0, 0, 0, 0)
      return date
    },
    end: () => {
      const date = new Date()
      date.setHours(23, 59, 59, 999)
      return date
    },
  },
  last30Days: {
    label: '最近30天',
    start: () => {
      const date = new Date()
      date.setDate(date.getDate() - 29)
      date.setHours(0, 0, 0, 0)
      return date
    },
    end: () => {
      const date = new Date()
      date.setHours(23, 59, 59, 999)
      return date
    },
  },
  thisMonth: {
    label: '本月',
    start: () => {
      const date = new Date()
      date.setDate(1)
      date.setHours(0, 0, 0, 0)
      return date
    },
    end: () => {
      const date = new Date()
      date.setMonth(date.getMonth() + 1, 0)
      date.setHours(23, 59, 59, 999)
      return date
    },
  },
  lastMonth: {
    label: '上月',
    start: () => {
      const date = new Date()
      date.setMonth(date.getMonth() - 1, 1)
      date.setHours(0, 0, 0, 0)
      return date
    },
    end: () => {
      const date = new Date()
      date.setDate(0)
      date.setHours(23, 59, 59, 999)
      return date
    },
  },
  thisYear: {
    label: '今年',
    start: () => {
      const date = new Date()
      date.setMonth(0, 1)
      date.setHours(0, 0, 0, 0)
      return date
    },
    end: () => {
      const date = new Date()
      date.setMonth(11, 31)
      date.setHours(23, 59, 59, 999)
      return date
    },
  },
}

/**
 * 尺寸对应的样式类名（如果需要）
 */
export const SIZE_CLASS_MAP = {
  small: 'dp-size-small',
  medium: 'dp-size-medium',
  large: 'dp-size-large',
} as const

/**
 * 默认的国际化文案（中文）
 */
export const DEFAULT_LOCALE_TEXTS = {
  placeholder: '请选择日期',
  rangePlaceholder: '请选择日期范围',
  clearLabel: '清空',
  cancelLabel: '取消',
  confirmLabel: '确定',
  todayLabel: '今天',
  nowLabel: '此刻',
  selectDate: '选择日期',
  selectTime: '选择时间',
  startDate: '开始日期',
  endDate: '结束日期',
  startTime: '开始时间',
  endTime: '结束时间',
} as const
