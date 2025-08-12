/* 守卫 */
import { routeWhitePathList } from '@/constants/modules/router'
import { useLoading, usePageTitle, useNprogress } from '@/hooks'
import { usePermissionStore, useUserStoreWithOut } from '@/stores'
import { computed } from 'vue'
import type { Router } from 'vue-router'
const { pageLoadingStart, pageLoadingDone } = useLoading()

export const usePermissionGuard = ({
  router,
  debug = false,
  initDynamicRoutes,
}: {
  router: Router
  debug?: boolean
  initDynamicRoutes: () => Promise<any>
}) => {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    const { startProgress } = useNprogress()
    const { updatePageTitle } = usePageTitle()
    startProgress()
    updatePageTitle()
    pageLoadingStart()
    const whiteList = routeWhitePathList
    const permissionStore = usePermissionStore()
    const userStore = useUserStoreWithOut()
    const isLogin = computed(() => userStore.isLogin)
    const isDynamicRoutesLoaded = computed(() => permissionStore.isDynamicRoutesLoaded)
    if (isLogin.value) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        if (isDynamicRoutesLoaded.value) {
          next()
          return
        }
        await initDynamicRoutes()
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        permissionStore.setDynamicRoutesLoaded(true)
        next(nextData)
      }
    } else {
      if (debug) {
        console.log('🪒 未登录')
      }
      if (whiteList.includes(to.path)) {
        if (debug) {
          console.log('🪒 白名单页面，直接放行->', to.path)
        }
        next()
      } else {
        if (debug) {
          console.log('🪒 跳转至登录页并重定向到目标->', to.path)
        }
        next(`/login?redirect=${to.path}`)
      }
    }
  })

  // 全局后置守卫
  router.afterEach((to, from) => {
    const { doneProgress } = useNprogress()
    const { updatePageTitle } = usePageTitle()
    doneProgress()
    updatePageTitle()
    pageLoadingDone()
    if (debug) {
      console.log(
        '🪒 afterEach',
        'to:',
        to?.path,
        `(${to?.name?.toString() || ''}) `,
        'from:',
        from?.path,
        `(${from?.name?.toString() || ''}) `
      )
    }
  })
}
