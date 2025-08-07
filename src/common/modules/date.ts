/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 时间处理工具
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import dayjs from 'dayjs'

// 导入插件
import dayOfYear from 'dayjs/plugin/dayOfYear.js'
import duration from 'dayjs/plugin/duration.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isoWeek from 'dayjs/plugin/isoWeek.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import weekday from 'dayjs/plugin/weekday.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'

// 扩展插件
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)
dayjs.extend(dayOfYear)

// 设置默认语言为英文
dayjs.locale('en')

export type DateInput = string | number | Date | dayjs.Dayjs
export type DateFormat = string
export type Locale = 'zh-cn' | 'en' | 'zh-tw'
export type TimeUnit =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
export type OpUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'

/**
 * 时间处理工具类
 */
export class DateUtils {
  /**
   * 设置语言环境
   */
  static async setLocale(locale: Locale) {
    // 动态导入语言包
    switch (locale) {
      case 'en':
        await import('dayjs/locale/en.js')
        break
      case 'zh-cn':
        await import('dayjs/locale/zh-cn.js')
        break
      case 'zh-tw':
        await import('dayjs/locale/zh-tw.js')
        break
    }

    dayjs.locale(locale)
  }

  /**
   * 同步设置语言环境（需要预先导入语言包）
   */
  static setLocaleSync(locale: Locale) {
    dayjs.locale(locale)
  }

  /**
   * 格式化日期
   */
  static format(date: DateInput, format: DateFormat = 'YYYY-MM-DD HH:mm:ss'): string {
    return dayjs(date).format(format)
  }

  /**
   * 获取相对时间
   */
  static fromNow(date: DateInput): string {
    return dayjs(date).fromNow()
  }

  /**
   * 获取相对时间（中文）
   */
  static async fromNowZh(date: DateInput): Promise<string> {
    // 获取当前语言环境
    const currentLocale = dayjs.locale()

    // 如果当前已经是中文环境，直接返回
    if (currentLocale === 'zh-cn' || currentLocale === 'zh-tw') {
      return dayjs(date).fromNow()
    }

    // 动态导入中文语言包
    await import('dayjs/locale/zh-cn.js')
    dayjs.locale('zh-cn')
    const result = dayjs(date).fromNow()
    dayjs.locale(currentLocale)
    return result
  }

  /**
   * 获取当前语言环境
   */
  static getLocale(): string {
    return dayjs.locale()
  }

  /**
   * 获取当前时间
   */
  static now(): dayjs.Dayjs {
    return dayjs()
  }

  /**
   * 解析日期
   */
  static parse(date: DateInput): dayjs.Dayjs {
    return dayjs(date)
  }

  /**
   * 检查是否为有效日期
   */
  static isValid(date: DateInput): boolean {
    return dayjs(date).isValid()
  }

  /**
   * 获取时间戳
   */
  static timestamp(date: DateInput = new Date()): number {
    return dayjs(date).valueOf()
  }

  /**
   * 日期加减
   */
  static add(date: DateInput, amount: number, unit: dayjs.ManipulateType): dayjs.Dayjs {
    return dayjs(date).add(amount, unit)
  }

  /**
   * 日期减法
   */
  static subtract(date: DateInput, amount: number, unit: dayjs.ManipulateType): dayjs.Dayjs {
    return dayjs(date).subtract(amount, unit)
  }

  /**
   * 获取日期开始时间
   */
  static startOf(date: DateInput, unit: dayjs.OpUnitType): dayjs.Dayjs {
    return dayjs(date).startOf(unit)
  }

  /**
   * 获取日期结束时间
   */
  static endOf(date: DateInput, unit: dayjs.OpUnitType): dayjs.Dayjs {
    return dayjs(date).endOf(unit)
  }

  /**
   * 比较日期
   */
  static isBefore(date1: DateInput, date2: DateInput): boolean {
    return dayjs(date1).isBefore(date2)
  }

  static isAfter(date1: DateInput, date2: DateInput): boolean {
    return dayjs(date1).isAfter(date2)
  }

  static isSame(date1: DateInput, date2: DateInput, unit?: dayjs.OpUnitType): boolean {
    return dayjs(date1).isSame(date2, unit)
  }

  static isSameOrBefore(date1: DateInput, date2: DateInput, unit?: dayjs.OpUnitType): boolean {
    return dayjs(date1).isSameOrBefore(date2, unit)
  }

  static isSameOrAfter(date1: DateInput, date2: DateInput, unit?: dayjs.OpUnitType): boolean {
    return dayjs(date1).isSameOrAfter(date2, unit)
  }

  /**
   * 检查日期是否在指定范围内
   */
  static isBetween(
    date: DateInput,
    start: DateInput,
    end: DateInput,
    unit?: dayjs.OpUnitType,
    inclusivity?: '()' | '[]' | '(]' | '[)'
  ): boolean {
    return dayjs(date).isBetween(start, end, unit, inclusivity)
  }

  /**
   * 获取日期差值
   */
  static diff(date1: DateInput, date2: DateInput, unit: dayjs.QUnitType = 'millisecond'): number {
    return dayjs(date1).diff(date2, unit)
  }

  /**
   * 获取日期范围
   */
  static range(start: DateInput, end: DateInput): dayjs.Dayjs[] {
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    const dates: dayjs.Dayjs[] = []

    let current = startDate
    while (current.isSameOrBefore(endDate)) {
      dates.push(current)
      current = current.add(1, 'day')
    }

    return dates
  }

  /**
   * 格式化持续时间
   */
  static formatDuration(milliseconds: number, format: 'short' | 'long' = 'long'): string {
    const duration = dayjs.duration(milliseconds)
    const hours = Math.floor(duration.asHours())
    const minutes = duration.minutes()
    const seconds = duration.seconds()

    if (format === 'short') {
      if (hours > 0) {
        return `${hours}h${minutes}m`
      } else if (minutes > 0) {
        return `${minutes}m${seconds}s`
      } else {
        return `${seconds}s`
      }
    } else {
      if (hours > 0) {
        return `${hours}小时${minutes}分钟`
      } else if (minutes > 0) {
        return `${minutes}分钟${seconds}秒`
      } else {
        return `${seconds}秒`
      }
    }
  }

  /**
   * 获取指定语言环境格式化的相对时间
   */
  static async fromNowWithLocale(date: DateInput, locale: Locale): Promise<string> {
    // 动态导入语言包
    switch (locale) {
      case 'en':
        await import('dayjs/locale/en.js')
        break
      case 'zh-cn':
        await import('dayjs/locale/zh-cn.js')
        break
      case 'zh-tw':
        await import('dayjs/locale/zh-tw.js')
        break
    }

    const currentLocale = dayjs.locale()
    dayjs.locale(locale)
    const result = dayjs(date).fromNow()
    dayjs.locale(currentLocale)
    return result
  }

  /**
   * 获取日期信息
   */
  static getDateInfo(date: DateInput) {
    const d = dayjs(date)
    return {
      year: d.year(),
      month: d.month() + 1, // dayjs 月份从 0 开始
      date: d.date(),
      day: d.day(), // 0-6, 0 是周日
      hour: d.hour(),
      minute: d.minute(),
      second: d.second(),
      millisecond: d.millisecond(),
      week: d.week(),
      quarter: d.quarter(),
    }
  }

  /**
   * 获取月份天数
   */
  static daysInMonth(date: DateInput): number {
    return dayjs(date).daysInMonth()
  }

  /**
   * 获取年份天数
   */
  static daysInYear(date: DateInput): number {
    const year = dayjs(date).year()
    const lastDay = dayjs(`${year}-12-31`)
    return lastDay.dayOfYear() as number
  }

  /**
   * 检查是否为闰年
   */
  static isLeapYear(date: DateInput): boolean {
    const year = dayjs(date).year()
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  /**
   * 获取月份名称
   */
  static getMonthName(date: DateInput, format: 'short' | 'long' = 'long'): string {
    const d = dayjs(date)
    const monthIndex = d.month()
    const monthNames = {
      short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      long: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    }
    return monthNames[format][monthIndex]
  }

  /**
   * 获取星期名称
   */
  static getWeekdayName(date: DateInput, format: 'short' | 'long' = 'long'): string {
    const d = dayjs(date)
    const dayIndex = d.day()
    const dayNames = {
      short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }
    return dayNames[format][dayIndex]
  }

  /**
   * 检查是否为工作日（周一到周五）
   */
  static isWeekday(date: DateInput): boolean {
    const day = dayjs(date).day()
    return day >= 1 && day <= 5
  }

  /**
   * 检查是否为周末
   */
  static isWeekend(date: DateInput): boolean {
    const day = dayjs(date).day()
    return day === 0 || day === 6
  }

  /**
   * 获取下一个工作日
   */
  static nextWeekday(date: DateInput): dayjs.Dayjs {
    let next = dayjs(date).add(1, 'day')
    while (this.isWeekend(next)) {
      next = next.add(1, 'day')
    }
    return next
  }

  /**
   * 获取上一个工作日
   */
  static prevWeekday(date: DateInput): dayjs.Dayjs {
    let prev = dayjs(date).subtract(1, 'day')
    while (this.isWeekend(prev)) {
      prev = prev.subtract(1, 'day')
    }
    return prev
  }

  /**
   * 获取时区信息
   */
  static getTimezone(): string {
    return dayjs.tz.guess()
  }

  /**
   * 转换时区
   */
  static convertTimezone(date: DateInput, targetTimezone: string): dayjs.Dayjs {
    return dayjs(date).tz(targetTimezone)
  }

  /**
   * 获取 UTC 时间
   */
  static toUTC(date: DateInput): dayjs.Dayjs {
    return dayjs(date).utc()
  }

  /**
   * 从 UTC 转换
   */
  static fromUTC(date: DateInput): dayjs.Dayjs {
    return dayjs.utc(date)
  }

  /**
   * 获取 Unix 时间戳
   */
  static unix(timestamp: number): dayjs.Dayjs {
    return dayjs.unix(timestamp)
  }

  /**
   * 获取 Unix 时间戳
   */
  static toUnix(date: DateInput): number {
    return dayjs(date).unix()
  }

  /**
   * 获取 ISO 字符串
   */
  static toISOString(date: DateInput): string {
    return dayjs(date).toISOString()
  }

  /**
   * 从 ISO 字符串解析
   */
  static fromISOString(isoString: string): dayjs.Dayjs {
    return dayjs(isoString)
  }

  /**
   * 获取日期对象
   */
  static toDate(date: DateInput): Date {
    return dayjs(date).toDate()
  }

  /**
   * 获取 JSON 格式
   */
  static toJSON(date: DateInput): string {
    return dayjs(date).toJSON()
  }

  /**
   * 获取字符串格式
   */
  static toString(date: DateInput): string {
    return dayjs(date).toString()
  }

  /**
   * 获取毫秒数
   */
  static valueOf(date: DateInput): number {
    return dayjs(date).valueOf()
  }

  /**
   * 获取年份
   */
  static year(date: DateInput): number {
    return dayjs(date).year()
  }

  /**
   * 获取月份（1-12）
   */
  static month(date: DateInput): number {
    return dayjs(date).month() + 1
  }

  /**
   * 获取日期
   */
  static date(date: DateInput): number {
    return dayjs(date).date()
  }

  /**
   * 获取小时
   */
  static hour(date: DateInput): number {
    return dayjs(date).hour()
  }

  /**
   * 获取分钟
   */
  static minute(date: DateInput): number {
    return dayjs(date).minute()
  }

  /**
   * 获取秒数
   */
  static second(date: DateInput): number {
    return dayjs(date).second()
  }

  /**
   * 获取毫秒
   */
  static millisecond(date: DateInput): number {
    return dayjs(date).millisecond()
  }

  /**
   * 获取星期几（0-6，0是周日）
   */
  static day(date: DateInput): number {
    return dayjs(date).day()
  }

  /**
   * 获取一年中的第几天
   */
  static dayOfYear(date: DateInput): number {
    return dayjs(date).dayOfYear() as number
  }

  /**
   * 获取一年中的第几周
   */
  static weekOfYear(date: DateInput): number {
    return dayjs(date).week()
  }

  /**
   * 获取 ISO 周数
   */
  static isoWeek(date: DateInput): number {
    return dayjs(date).isoWeek()
  }

  /**
   * 获取季度
   */
  static quarter(date: DateInput): number {
    return dayjs(date).quarter()
  }

  /**
   * 获取年龄
   */
  static getAge(birthDate: DateInput): number {
    const birth = dayjs(birthDate)
    const now = dayjs()
    return now.diff(birth, 'year')
  }

  /**
   * 获取两个日期之间的工作日数量
   */
  static getWorkdaysBetween(start: DateInput, end: DateInput): number {
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    let workdays = 0
    let current = startDate

    while (current.isSameOrBefore(endDate)) {
      if (this.isWeekday(current)) {
        workdays++
      }
      current = current.add(1, 'day')
    }

    return workdays
  }

  /**
   * 获取日期范围的工作日
   */
  static getWorkdaysInRange(start: DateInput, end: DateInput): dayjs.Dayjs[] {
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    const workdays: dayjs.Dayjs[] = []
    let current = startDate

    while (current.isSameOrBefore(endDate)) {
      if (this.isWeekday(current)) {
        workdays.push(current)
      }
      current = current.add(1, 'day')
    }

    return workdays
  }

  /**
   * 获取日期范围的所有日期
   */
  static getDatesInRange(start: DateInput, end: DateInput): dayjs.Dayjs[] {
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    const dates: dayjs.Dayjs[] = []
    let current = startDate

    while (current.isSameOrBefore(endDate)) {
      dates.push(current)
      current = current.add(1, 'day')
    }

    return dates
  }

  /**
   * 获取月份的所有日期
   */
  static getDatesInMonth(date: DateInput): dayjs.Dayjs[] {
    const start = dayjs(date).startOf('month')
    const end = dayjs(date).endOf('month')
    return this.getDatesInRange(start, end)
  }

  /**
   * 获取年份的所有月份
   */
  static getMonthsInYear(date: DateInput): dayjs.Dayjs[] {
    const year = dayjs(date).year()
    const months: dayjs.Dayjs[] = []

    for (let month = 0; month < 12; month++) {
      months.push(dayjs().year(year).month(month))
    }

    return months
  }

  /**
   * 获取季度范围
   */
  static getQuarterRange(date: DateInput): { start: dayjs.Dayjs; end: dayjs.Dayjs } {
    const d = dayjs(date)
    const quarter = d.quarter()
    const year = d.year()

    let startMonth: number
    switch (quarter) {
      case 1:
        startMonth = 0 // 一月
        break
      case 2:
        startMonth = 3 // 四月
        break
      case 3:
        startMonth = 6 // 七月
        break
      case 4:
        startMonth = 9 // 十月
        break
      default:
        startMonth = 0
    }

    const start = dayjs().year(year).month(startMonth).startOf('month')
    const end = dayjs()
      .year(year)
      .month(startMonth + 2)
      .endOf('month')

    return { start, end }
  }

  /**
   * 获取周范围
   */
  static getWeekRange(date: DateInput): { start: dayjs.Dayjs; end: dayjs.Dayjs } {
    const d = dayjs(date)
    const start = d.startOf('week')
    const end = d.endOf('week')
    return { start, end }
  }

  /**
   * 获取月份范围
   */
  static getMonthRange(date: DateInput): { start: dayjs.Dayjs; end: dayjs.Dayjs } {
    const d = dayjs(date)
    const start = d.startOf('month')
    const end = d.endOf('month')
    return { start, end }
  }

  /**
   * 获取年份范围
   */
  static getYearRange(date: DateInput): { start: dayjs.Dayjs; end: dayjs.Dayjs } {
    const d = dayjs(date)
    const start = d.startOf('year')
    const end = d.endOf('year')
    return { start, end }
  }

  /**
   * 检查是否为今天
   */
  static isToday(date: DateInput): boolean {
    return dayjs(date).isSame(dayjs(), 'day')
  }

  /**
   * 检查是否为昨天
   */
  static isYesterday(date: DateInput): boolean {
    return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
  }

  /**
   * 检查是否为明天
   */
  static isTomorrow(date: DateInput): boolean {
    return dayjs(date).isSame(dayjs().add(1, 'day'), 'day')
  }

  /**
   * 检查是否为本周
   */
  static isThisWeek(date: DateInput): boolean {
    return dayjs(date).isSame(dayjs(), 'week')
  }

  /**
   * 检查是否为本月
   */
  static isThisMonth(date: DateInput): boolean {
    return dayjs(date).isSame(dayjs(), 'month')
  }

  /**
   * 检查是否为本年
   */
  static isThisYear(date: DateInput): boolean {
    return dayjs(date).isSame(dayjs(), 'year')
  }

  /**
   * 获取友好的时间显示
   */
  static getFriendlyTime(date: DateInput): string {
    const d = dayjs(date)
    const now = dayjs()

    if (this.isToday(d)) {
      return `今天 ${d.format('HH:mm')}`
    } else if (this.isYesterday(d)) {
      return `昨天 ${d.format('HH:mm')}`
    } else if (this.isTomorrow(d)) {
      return `明天 ${d.format('HH:mm')}`
    } else if (d.isSame(now, 'week')) {
      return d.format('dddd HH:mm')
    } else if (d.isSame(now, 'year')) {
      return d.format('MM-DD HH:mm')
    } else {
      return d.format('YYYY-MM-DD HH:mm')
    }
  }
}

// 导出 dayjs 实例，方便直接使用
export { dayjs }

// 默认导出工具类
export default DateUtils
