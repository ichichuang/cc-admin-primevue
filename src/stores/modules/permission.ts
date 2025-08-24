import { getFlatMenuTree, getFlatRouteList } from '@/common'
import store from '@/stores'
import { env } from '@/utils'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'

/* 设置 tab 渲染数据 */
export interface TabItem {
  name: string // 路由名称（索引）
  path: string // 路由路径
  label: string // 标签文本（展示）
  active: boolean // 是否为当前路由（高亮显示）
  icon?: string // 图标
  fixed: boolean // 是否固定(固定标签不可删除)
  deletable: boolean // 是否可删除(默认 true 可删除)
}
interface PermissionState {
  // 静态路由
  staticRoutes: RouteConfig[]
  // 动态路由
  dynamicRoutes: BackendRouteConfig[]
  // 动态路由是否已加载完成
  isDynamicRoutesLoaded: boolean
  // 标签页
  tabs: TabItem[]
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
      const flattenMenuTree = getFlatMenuTree()
      const route = getFlatRouteList().find(route => route.name === name || route.path === name)
      if (route) {
        // 如果标签页已存在，则不添加
        if (this.tabs.some(tab => tab.name === name || tab.path === name)) {
          return
        }
        // 只有菜单树中存在的路由才添加到标签页
        if (flattenMenuTree.some(menu => menu.path === route.path)) {
          // 确保路由数据符合 TabItem 接口要求
          const tabItem: TabItem = {
            name: route.name || '',
            path: route.path || '',
            label: route.meta?.title || route.name || '',
            active: false,
            icon: route.meta?.icon,
            fixed: route.meta?.fixed || false,
            deletable: route.meta?.deletable !== false,
          }
          this.tabs.push(tabItem)
        }
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
    // 批量移除标签页（保留指定的标签页）
    removeTabsExcept(names: (RouteConfig['name'] | RouteConfig['path'])[]) {
      this.tabs = this.tabs.filter(tab =>
        names.some(name => tab.name === name || tab.path === name)
      )
    },
    // 移除指定索引范围的标签页
    removeTabsByIndexRange(startIndex: number, endIndex: number) {
      this.tabs = this.tabs.filter((_, index) => index < startIndex || index > endIndex)
    },
    // 修改标签页某一项的属性 传入 name|path 和 {property: value}
    updateTabProperty(
      name: RouteConfig['name'] | RouteConfig['path'],
      property: { property: any; value: any }
    ) {
      const tab = this.tabs.find(tab => tab.name === name || tab.path === name)
      if (tab) {
        tab[property.property as keyof TabItem] = property.value as never
      }
    },
    // 清空标签页
    clearTabs() {
      this.tabs = []
    },
    // 更新标签页的属性
    updateTabMeta(name: RouteConfig['name'] | RouteConfig['path'], meta: Partial<TabItem>) {
      const tab = this.tabs.find(tab => tab.name === name || tab.path === name)
      if (tab) {
        Object.assign(tab, meta)
      }
    },
    // 更新标签页的激活状态
    updateTabActive(name: RouteConfig['name'] | RouteConfig['path']) {
      // 先将所有标签页设置为非激活状态
      this.tabs.forEach(tab => {
        tab.active = false
      })
      // 将指定的标签页设置为激活状态
      const targetTab = this.tabs.find(tab => tab.name === name || tab.path === name)
      if (targetTab) {
        targetTab.active = true
      }
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
