/**
 * Vue 类型声明
 */

// Vue I18n 全局类型声明
import type { ComposerTranslation } from 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: ComposerTranslation
    $te: (key: string) => boolean
    $d: (value: number | Date, key?: string, locale?: string) => string
    $n: (value: number, key?: string, locale?: string) => string
    $tm: (key: string) => any
    $rt: (message: string) => string
  }
}

// 声明全局类型
declare global {
  interface Window {
    $message: any
    /** 全局路由工具 */
    $routeUtils?: RouteUtils
    /** 全局权限检查函数 */
    $hasAuth?: (value: string | string[]) => boolean
  }
}
