import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { getFlatRouteList } from '@/common'

interface PermissionState {
  // 静态路由
  staticRoutes: RouteConfig[]
  // 动态路由
  dynamicRoutes: BackendRouteConfig[]
  // 动态路由是否已加载完成
  isDynamicRoutesLoaded: boolean
  // 标签页
  tabs: RouteConfig[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    staticRoutes: [],
    dynamicRoutes: [],
    isDynamicRoutesLoaded: false,
    tabs: [],
  }),

  getters: {
    getStaticRoutes: (state: PermissionState) => state.staticRoutes,
    getDynamicRoutes: (state: PermissionState) => state.dynamicRoutes,
    // 获取动态路由加载状态
    getIsDynamicRoutesLoaded: (state: PermissionState) => state.isDynamicRoutesLoaded,
    // 获取所有路由（静态 + 动态）
    getAllRoutes: (state: PermissionState) =>
      [...toRaw(state.staticRoutes), ...toRaw(state.dynamicRoutes)] as RouteConfig[],
    // 获取标签页
    getTabs: (state: PermissionState) => state.tabs,
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
    // 添加标签页
    addTab(name: RouteConfig['name'] | RouteConfig['path']) {
      const route = getFlatRouteList().find(route => route.name === name || route.path === name)
      if (route) {
        // 如果标签页已存在，则不添加
        if (this.tabs.some(tab => tab.name === name || tab.path === name)) {
          return
        }
        this.tabs.push(route)
      }
    },
    // 移除标签页
    removeTab(name: RouteConfig['name'] | RouteConfig['path']) {
      // 如果标签页不存在，则不移除
      if (!this.tabs.some(tab => tab.name === name || tab.path === name)) {
        return
      }
      this.tabs = this.tabs.filter(tab => tab.name !== name && tab.path !== name)
    },
    // 清空标签页
    clearTabs() {
      this.tabs = []
    },
    // 重置
    reset() {
      this.staticRoutes = []
      this.dynamicRoutes = []
      this.isDynamicRoutesLoaded = false
      this.tabs = []
    },
  },

  persist: {
    key: `${env.piniaKeyPrefix}-permission`,
    storage: localStorage,
    pick: ['staticRoutes', 'dynamicRoutes', 'tabs'],
  },
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
