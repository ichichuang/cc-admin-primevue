/**
 * 繁体中文语言包 (zh-TW)
 */
import { authZhTW } from '@/locales/modules/auth'
import { commonZhTW } from '@/locales/modules/common'
import { dashboardZhTW } from '@/locales/modules/dashboard'
import { permissionZhTW } from '@/locales/modules/permission'
import { routerZhTW } from '@/locales/modules/router'
import { userZhTW } from '@/locales/modules/user'

// 为了保持向后兼容，同时导出具名导出和默认导出
export const zhTW = {
  auth: authZhTW,
  common: commonZhTW,
  user: userZhTW,
  dashboard: dashboardZhTW,
  permission: permissionZhTW,
  router: routerZhTW,
}

// i18n Ally 期望的默认导出
export default zhTW
