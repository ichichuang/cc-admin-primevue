/* 引入 lodash-es */
import * as _ from 'lodash-es'

// 工具函数集合

/**
 * 深拷贝
 * @param obj 对象
 * @returns 深拷贝后的对象
 */
export function cloneDeep<T>(obj: T): T {
  return _.cloneDeep(obj)
}

/**
 * 防抖
 * @param func 函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export const debounce = _.debounce as (
  func: (...args: any[]) => any,
  wait: number
) => (...args: any[]) => any

/**
 * 节流
 * @param func 函数
 * @param wait 等待时间
 * @returns 节流后的函数
 */
export const throttle = _.throttle as (
  func: (...args: any[]) => any,
  wait: number
) => (...args: any[]) => any
