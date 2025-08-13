/* 守卫 */
import { routeWhitePathList } from '@/constants/modules/router'
import { useLoading, useNprogress, usePageTitle } from '@/hooks'
import { usePermissionStore, useUserStoreWithOut } from '@/stores'
import { computed } from 'vue'
import type { Router } from 'vue-router'
const { loadingStart, loadingDone, pageLoadingStart, pageLoadingDone } = useLoading()

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
        loadingDone()
        next({ path: '/' })
      } else {
        if (isDynamicRoutesLoaded.value) {
          loadingDone()
          next()
          return
        }
        loadingStart()
        await initDynamicRoutes()
        loadingDone()
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        permissionStore.setDynamicRoutesLoaded(true)
        next(nextData)
      }
    } else {
      if (debug) {
        console.log('🪒-Router: 未登录')
      }
      if (whiteList.includes(to.path)) {
        if (debug) {
          console.log('🪒-Router: 白名单页面，直接放行->', to.path)
        }
        loadingDone()
        next()
      } else {
        if (debug) {
          console.log('🪒-Router: 跳转至登录页并重定向到目标->', to.path)
        }
        loadingDone()
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
        '🪒-Router: afterEach',
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
