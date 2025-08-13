// 声明全局类型
declare global {
  /** 工具类型 */
  type Nullable<T> = T | null
  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
  type Recordable<T = any, K extends string = string> = Record<K, T>
  type ComponentRef<T extends abstract new (...args: any) => any> = InstanceType<T>

  /** 浏览器 API 类型扩展 */
  interface Window {
    requestIdleCallback: (
      callback: (deadline: IdleDeadline) => void,
      opts?: { timeout?: number }
    ) => number
    cancelIdleCallback: (handle: number) => void
  }

  interface IdleDeadline {
    timeRemaining: () => number
  }
}
