/**
 * 国际化类型定义
 * 定义项目中使用的所有语言配置类型
 */

import type { AuthLocaleMessages } from '@/locales/types/modules/auth'
import type { CommonLocaleMessages } from '@/locales/types/modules/common'
import type { DashboardLocaleMessages } from '@/locales/types/modules/dashboard'
import type { PermissionLocaleMessages } from '@/locales/types/modules/permission'
import type { RouterLocaleMessages } from '@/locales/types/modules/router'
import type { UserLocaleMessages } from '@/locales/types/modules/user'

/** 支持的语言类型 */
export type SupportedLocale = 'zh-CN' | 'en-US' | 'zh-TW'

/** 语言配置信息 */
export interface LocaleInfo {
  key: SupportedLocale
  name: string
  flag: string
  direction: 'ltr' | 'rtl'
}

export interface LocaleMessages {
  auth: AuthLocaleMessages
  common: CommonLocaleMessages
  user: UserLocaleMessages
  dashboard: DashboardLocaleMessages
  permission: PermissionLocaleMessages
  router: RouterLocaleMessages
}
