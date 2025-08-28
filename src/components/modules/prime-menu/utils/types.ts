import type { MenuItem } from 'primevue/menuitem'

// 菜单类型
export type MenuType = 'custom' | 'bar' | 'mega' | 'panel' | 'tier'

// 菜单属性接口
export interface MenuProps {
  type: MenuType // 菜单类型
  items: MenuItem[] // 菜单项
  componentsProps: Record<string, any> // 菜单组件属性（通用对象）
}

// 类型安全的菜单属性接口 - 重载版本
export interface TypedMenuProps<T extends MenuType> {
  type?: T
  items: MenuItem[] // 直接使用 PrimeVue 的 MenuItem 类型
  componentsProps?: Record<string, any>
}

// 扩展键类型（用于 PanelMenu 的 expandedKeys）
export type ExpandedKeys = Record<string | number, boolean>

// PanelMenu 特有的属性
export interface PanelMenuProps extends MenuProps {
  expandedKeys?: ExpandedKeys // 控制展开状态的键值对
}
