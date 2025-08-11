// 声明全局类型
declare global {
  /** 布局配置接口 */
  interface LayoutConfig {
    showHeader: boolean
    showMenu: boolean
    showSidebar: boolean
    showBreadcrumb: boolean
    showFooter: boolean
    showTabs: boolean
  }

  /** 布局状态接口 */
  interface LayoutState {
    // 当前布局模式
    currentLayout: LayoutMode
    // 布局配置
    layoutConfig: LayoutConfig
    // 侧边栏折叠状态
    sidebarCollapsed: boolean
    // 移动端侧边栏可见状态
    mobileSidebarVisible: boolean

    // 框架加载状态
    isLoading: boolean
    // 页面加载状态
    isPageLoading: boolean

    // 设备信息
    deviceInfo: DeviceInfo
  }
}

// 导出空对象使其成为外部模块
export {}
