import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'

interface PermissionState {
  // 静态路由
  staticRoutes: RouteConfig[]
  // 动态路由
  dynamicRoutes: BackendRouteConfig[]
  // 动态路由是否已加载完成
  isDynamicRoutesLoaded: boolean
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    staticRoutes: [],
    dynamicRoutes: [],
    isDynamicRoutesLoaded: false,
  }),

  getters: {
    getStaticRoutes: (state: PermissionState) => state.staticRoutes,
    getDynamicRoutes: (state: PermissionState) => state.dynamicRoutes,
    // 获取动态路由加载状态
    getIsDynamicRoutesLoaded: (state: PermissionState) => state.isDynamicRoutesLoaded,
    // 获取所有路由（静态 + 动态）
    getAllRoutes: (state: PermissionState) => [...state.staticRoutes, ...state.dynamicRoutes],
  },

  actions: {
    // 设置静态路由
    setStaticRoutes(routes: RouteConfig[]) {
      this.staticRoutes = routes
    },
    // 设置动态路由
    setDynamicRoutes(routes: BackendRouteConfig[]) {
      this.dynamicRoutes = routes
    },
    // 设置动态路由加载状态
    setDynamicRoutesLoaded(loaded: boolean) {
      this.isDynamicRoutesLoaded = loaded
    },

    // 重置
    reset() {
      this.staticRoutes = []
      this.dynamicRoutes = []
      this.isDynamicRoutesLoaded = false
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-permission`,
    storage: localStorage,
    pick: ['staticRoutes', 'dynamicRoutes'],
  },
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
