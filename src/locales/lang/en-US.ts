/**
 * 英文语言包 (en-US)
 */
import { authEnUS } from '@/locales/modules/auth'
import { commonEnUS } from '@/locales/modules/common'
import { dashboardEnUS } from '@/locales/modules/dashboard'
import { permissionEnUS } from '@/locales/modules/permission'
import { routerEnUS } from '@/locales/modules/router'
import { userEnUS } from '@/locales/modules/user'

// 为了保持向后兼容，同时导出具名导出和默认导出
export const enUS = {
  auth: authEnUS,
  common: commonEnUS,
  user: userEnUS,
  dashboard: dashboardEnUS,
  permission: permissionEnUS,
  router: routerEnUS,
}

// i18n Ally 期望的默认导出
export default enUS
