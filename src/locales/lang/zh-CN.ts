/**
 * 中文语言包 (zh-CN)
 */
import { authZhCN } from '@/locales/modules/auth'
import { commonZhCN } from '@/locales/modules/common'
import { dashboardZhCN } from '@/locales/modules/dashboard'
import { permissionZhCN } from '@/locales/modules/permission'
import { routerZhCN } from '@/locales/modules/router'
import { userZhCN } from '@/locales/modules/user'

// 为了保持向后兼容，同时导出具名导出和默认导出
export const zhCN = {
  auth: authZhCN,
  common: commonZhCN,
  user: userZhCN,
  dashboard: dashboardZhCN,
  permission: permissionZhCN,
  router: routerZhCN,
}

// i18n Ally 期望的默认导出
export default zhCN
