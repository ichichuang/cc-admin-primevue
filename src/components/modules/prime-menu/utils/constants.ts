import type { MenuProps } from './types'

export const defaultMenuProps: Partial<MenuProps> = {
  type: 'custom' as const,
  items: [] as MenuProps['items'],
  componentsProps: {} as MenuProps['componentsProps'],
}

/**
 * PrimeVue MenuItem 参数说明
 *
 * 公共参数（所有菜单组件通用）：
 * ------------------------------------------------------
 * label     : string   菜单项文本
 * icon      : string   图标 class
 * command   : function 点击菜单项时触发的回调 (event) => void
 * url       : string   外部跳转链接
 * target    : string   链接目标窗口，例如 "_blank"
 * route     : string|object 内部路由对象/字符串 (router-link)
 * items     : MenuItem[] 子菜单项（支持多级嵌套）
 *
 * 可选扩展参数（部分组件支持）：
 * ------------------------------------------------------
 * badge     : string|number   徽章值，显示在菜单项旁
 * shortcut  : string          快捷键展示文本
 * disabled  : boolean         是否禁用菜单项 (Menu / TieredMenu)
 * visible   : boolean         是否显示菜单项 (Menu / TieredMenu)
 *
 * 特殊参数（特定组件专属）：
 * ------------------------------------------------------
 * PanelMenu:
 *   key     : string|number   唯一 key，用于 expandedKeys 控制展开状态
 *
 * MegaMenu:
 *   image   : string   菜单项图片地址
 *   subtext : string   菜单项副标题/描述
 *   root    : boolean  是否为根级菜单项
 *
 * 组件差异总结：
 * ------------------------------------------------------
 * - Menu / Menubar:
 *   支持 label, icon, command, url, target, route, badge, shortcut, disabled?, visible?, items
 *
 * - MegaMenu:
 *   支持 label, icon, command, url, target, route, image, subtext, root, items
 *
 * - PanelMenu:
 *   支持 label, icon, command, url, target, route, badge, shortcut, key, items
 *
 * - TieredMenu:
 *   支持 label, icon, command, url, target, route, badge, shortcut, disabled, visible, items
 */

/**
 * PrimeVue 菜单组件 Props & Events 说明
 *
 * 支持的组件类型：
 * type Types = 'custom' | 'bar' | 'mega' | 'panel' | 'tier'
 * ------------------------------------------------------
 * custom -> Menu
 * bar    -> Menubar
 * mega   -> MegaMenu
 * panel  -> PanelMenu
 * tier   -> TieredMenu
 *
 * ============ 公共说明 ============
 * - 所有菜单组件都依赖 MenuItem 结构（见 menuitem-doc.ts）。
 * - MenuItem 的点击、禁用、图标等逻辑在不同组件通用。
 * - 不同菜单组件 Props / Events 不完全一致。
 *
 * ============ custom: Menu ============
 * Props:
 *  - popup: boolean = false        // 是否作为弹出菜单显示
 *  - appendTo: string|HTMLElement = 'body' // 附加 DOM 位置: 'body' | 'self' | Element
 *  - autoZIndex: boolean = true    // 是否自动管理 zIndex
 *  - baseZIndex: number = 0        // 基础 zIndex
 *  - id: string = null             // 组件唯一 ID
 *  - class: string = null          // CSS class
 *  - style: object = null          // 内联样式
 *  - tabindex: number = 0          // Tab 键顺序
 *  - ariaLabel: string = null      // 无障碍 aria 标签
 *  - ariaLabelledby: string = null // aria-labelledby 属性
 * Events:
 *  - show(): void                  // 菜单显示时触发
 *  - hide(): void                  // 菜单隐藏时触发
 *  - focus(event): void            // 获取焦点时
 *  - blur(event): void             // 失去焦点时
 * Notes:
 *  - 常用于上下文菜单 / 右键菜单。
 *
 * ============ bar: Menubar ============
 * Props:
 *  - start: any = null             // 菜单项前插槽
 *  - end: any = null               // 菜单项后插槽
 *  - breakpoint: string = '960px'  // 响应式断点，低于该宽度折叠
 *  - id, class, style 同上
 * Events:
 *  - 无专有事件，点击通过 MenuItem.command 回调
 * Notes:
 *  - 典型的顶部导航栏，支持响应式。
 *
 * ============ mega: MegaMenu ============
 * Props:
 *  - orientation: 'horizontal' | 'vertical' = 'horizontal' // 菜单方向
 *  - start: any = null
 *  - end: any = null
 *  - breakpoint: string = '960px'
 *  - id, class, style 同上
 * Events:
 *  - 无专有事件，交互依赖 MenuItem.command
 * Notes:
 *  - 支持多列布局、图像、子标题，适合复杂导航。
 *
 * ============ panel: PanelMenu ============
 * Props:
 *  - multiple: boolean = false     // 是否允许多个根节点同时展开
 *  - expandedKeys: object = null   // 展开的节点 Map，{ key: boolean }
 *  - id, class, style 同上
 * Events:
 *  - update:expandedKeys(newKeys: object) // 展开状态变化时触发
 * Notes:
 *  - 手风琴式菜单，适合侧边导航。
 *  - MenuItem 需要设置 key 用于展开控制。
 *
 * ============ tier: TieredMenu ============
 * Props:
 *  - popup: boolean = false
 *  - appendTo: string|HTMLElement = null
 *  - autoZIndex: boolean = true
 *  - baseZIndex: number = 0
 *  - id, class, style, tabindex, ariaLabel, ariaLabelledby 同上
 * Events:
 *  - show(): void
 *  - hide(): void
 * Notes:
 *  - 类似 Menu，但支持分层嵌套弹出子菜单。
 *  - 常用于右键菜单 / 下拉导航。
 *
 * ============ 对比总结 ============
 * - Menu / TieredMenu: 支持 popup 弹出模式，右键或按钮触发。
 * - Menubar: 顶部导航栏，响应式，可加 start/end 插槽。
 * - MegaMenu: 横向或纵向的大型导航，支持多列内容。
 * - PanelMenu: 手风琴面板，适合左侧树形菜单。
 */
