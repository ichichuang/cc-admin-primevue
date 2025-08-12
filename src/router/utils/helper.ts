/* 注册路由 */
import { getAuthRoutes } from '@/api/modules/auth'
import { cloneDeep } from '@/common'
import { usePermissionStore } from '@/stores'
import { computed } from 'vue'
import type { Router } from 'vue-router'
import { createDynamicRouteManager, processAsyncRoutes } from './common'
import { usePermissionGuard } from './permission'

export const registerRouterGuards = ({
  router,
  debug = false,
}: {
  router: Router
  debug?: boolean
}) => {
  const dynamicRouteManager = createDynamicRouteManager(router)

  // 加载动态路由
  const initDynamicRoutes = async (): Promise<any> => {
    const rootRedirect: RouteConfig[] = [
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/notfound/not-found-page.vue'),
        meta: {
          titleKey: 'router.error.notFound',
          showLink: false,
          parent: 'fullscreen',
        },
      },
      {
        path: '/403',
        name: '403',
        component: () => import('@/views/notfound/forbidden-page.vue'),
        meta: {
          titleKey: 'router.error.forbidden',
          showLink: false,
          parent: 'fullscreen',
        },
      },
      {
        path: '/500',
        name: '500',
        component: () => import('@/views/notfound/server-error-page.vue'),
        meta: {
          titleKey: 'router.error.serverError',
          showLink: false,
          parent: 'fullscreen',
        },
      },
      // 捕获所有未匹配的路由，重定向到404页面
      {
        path: '/:pathMatch(.*)*',
        name: 'CatchAll',
        redirect: '/404',
      },
    ]

    const permissionStore = usePermissionStore()
    const dynamicRoutes = computed(() => permissionStore.getDynamicRoutes)
    const allRoutes = computed(() => permissionStore.getAllRoutes)

    let asyncRoutes: RouteConfig[] = []

    // 如果本地已有动态路由数据
    if (dynamicRoutes.value.length > 0) {
      if (debug) {
        console.log('🪒 从本地获取的动态路由')
      }
      const cloneDynamicRoutes = cloneDeep(dynamicRoutes.value) as BackendRouteConfig[]
      asyncRoutes = processAsyncRoutes(cloneDynamicRoutes)

      // 同步处理，直接添加路由
      dynamicRouteManager.addRoutes([...asyncRoutes])
      dynamicRouteManager.addRoutes([...rootRedirect])
      if (debug) {
        console.log('🪒 添加动态路由成功', dynamicRouteManager.getRoutes())
      }

      return allRoutes.value
    } else {
      // 需要从后端获取动态路由数据
      if (debug) {
        console.log('🪒 从后端接口获取的动态路由')
      }

      try {
        const { data } = await getAuthRoutes()

        // 保存到 store
        permissionStore.setDynamicRoutes(data)

        // 处理路由配置
        asyncRoutes = processAsyncRoutes(data)

        // 添加路由
        dynamicRouteManager.addRoutes([...asyncRoutes])
        dynamicRouteManager.addRoutes([...rootRedirect])

        if (debug) {
          console.log('🪒 添加动态路由成功', dynamicRouteManager.getRoutes())
        }
      } catch (error) {
        console.error('🪒 获取动态路由失败:', error)
        throw error
      }
    }
  }

  // 注册权限守卫
  usePermissionGuard({ router, debug, initDynamicRoutes })

  return dynamicRouteManager
}
