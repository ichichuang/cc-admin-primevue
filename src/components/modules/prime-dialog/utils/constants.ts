import type { DialogOptions } from './types'

export const defaultDialogProps: Partial<DialogOptions> = {
  type: 'dialog' as const,
  visible: false,
  header: '',
  width: '50%',
  height: 'auto',
  fullscreen: false,
  fullscreenIcon: false,
  draggable: false,
  modal: true,
  position: 'center',
  appendTo: 'body',
  maximizable: false,
  minimizable: false,
  closeOnEscape: true,
  closeOnMask: true,
  closable: true,
  center: false,
  destroyOnClose: false,
  hideFooter: false,
  sureBtnLoading: false,
  openDelay: 0,
  closeDelay: 200,
}

/**
 * PrimeVue Dialog 组件 Props & Events 说明
 *
 * 支持的组件类型：
 * type Types = 'dialog' | 'confirm' | 'dynamic'
 * ------------------------------------------------------
 * dialog  -> Dialog (标准对话框)
 * confirm -> ConfirmDialog (确认对话框)
 * dynamic -> DynamicDialog (动态对话框)
 *
 * ============ dialog: Dialog ============
 * Props:
 *  - visible: boolean = false        // 是否显示对话框
 *  - header: string = null           // 对话框标题
 *  - width: string = '50%'           // 对话框宽度
 *  - height: string = 'auto'         // 对话框高度
 *  - maximizable: boolean = false    // 是否可最大化
 *  - minimizable: boolean = false    // 是否可最小化
 *  - closeOnEscape: boolean = true   // 按ESC键关闭
 *  - closeOnMask: boolean = true     // 点击遮罩关闭
 *  - closable: boolean = true        // 显示关闭按钮
 *  - modal: boolean = true           // 是否显示遮罩
 *  - draggable: boolean = false      // 是否可拖拽
 *  - position: string = 'center'     // 对话框位置
 *  - appendTo: string = 'body'       // 附加到指定元素
 *  - resizable: boolean = false      // 是否可调整大小
 *  - keepInViewport: boolean = true  // 保持在视口内
 *  - breakpoints: object = null      // 响应式断点
 *  - style: object = null            // 内联样式
 *  - class: string = null            // CSS类名
 * Events:
 *  - show(): void                    // 显示时触发
 *  - hide(): void                    // 隐藏时触发
 *  - maximize(): void                // 最大化时触发
 *  - minimize(): void                // 最小化时触发
 *  - restore(): void                 // 恢复时触发
 *
 * ============ confirm: ConfirmDialog ============
 * Props:
 *  - group: string = null            // 对话框组名
 *  - position: string = 'center'     // 对话框位置
 *  - style: object = null            // 内联样式
 *  - class: string = null            // CSS类名
 * Events:
 *  - accept(): void                  // 确认时触发
 *  - reject(): void                  // 取消时触发
 *
 * ============ dynamic: DynamicDialog ============
 * Props:
 *  - component: Component            // 要渲染的组件
 *  - props: object = null            // 传递给组件的props
 *  - data: object = null             // 传递给组件的数据
 *  - listeners: object = null        // 事件监听器
 *  - style: object = null            // 内联样式
 *  - class: string = null            // CSS类名
 * Events:
 *  - 通过 listeners 传递事件
 *
 * ============ 按钮配置说明 ============
 * 默认按钮配置：
 * - 取消按钮：label="取消", severity="secondary", text=true
 * - 确定按钮：label="确定", severity="primary", text=true
 *
 * 按钮属性：
 * - label: string                    // 按钮文字
 * - severity: ButtonType             // 按钮类型
 * - loading: boolean                 // 加载状态
 * - disabled: boolean                // 禁用状态
 * - icon: string                     // 图标
 * - text: boolean                    // 文字按钮
 * - outlined: boolean                // 轮廓按钮
 * - rounded: boolean                 // 圆角按钮
 * - size: 'small' | 'normal' | 'large' // 按钮尺寸
 *
 * ============ 使用示例 ============
 * 1. 标准对话框：
 *    addDialog({
 *      type: 'dialog',
 *      header: '标题',
 *      contentRenderer: ({ options, index }) => h('div', '内容')
 *    })
 *
 * 2. 确认对话框：
 *    addDialog({
 *      type: 'confirm',
 *      confirmOptions: {
 *        header: '确认',
 *        message: '确定要删除吗？',
 *        acceptLabel: '确定',
 *        rejectLabel: '取消'
 *      }
 *    })
 *
 * 3. 动态对话框：
 *    addDialog({
 *      type: 'dynamic',
 *      component: MyComponent,
 *      props: { data: 'value' }
 *    })
 *
 * 4. 不可点击遮罩关闭的对话框：
 *    addDialog({
 *      type: 'dialog',
 *      header: '标题',
 *      closeOnMask: false,
 *      closeOnEscape: false,
 *      contentRenderer: ({ options, index }) => h('div', '内容')
 *    })
 *
 * 5. 可拖拽对话框：
 *    addDialog({
 *      type: 'dialog',
 *      header: '标题',
 *      draggable: true,
 *      contentRenderer: ({ options, index }) => h('div', '内容')
 *    })
 *
 * 6. 无遮罩对话框：
 *    addDialog({
 *      type: 'dialog',
 *      header: '标题',
 *      modal: false,
 *      contentRenderer: ({ options, index }) => h('div', '内容')
 *    })
 *
 * 7. 自定义位置对话框：
 *    addDialog({
 *      type: 'dialog',
 *      header: '标题',
 *      position: 'top',
 *      contentRenderer: ({ options, index }) => h('div', '内容')
 *    })
 *
 * 8. 嵌套对话框：
 *    addDialog({
 *      type: 'dialog',
 *      header: '外层对话框',
 *      contentRenderer: ({ options, index }) => h('div', [
 *        h('p', '外层内容'),
 *        h('button', { onClick: () => addDialog({ header: '内层对话框' }) }, '打开内层')
 *      ])
 *    })
 *
 * 9. 可更新属性对话框：
 *    const index = dialogStore.value.length
 *    addDialog({
 *      type: 'dialog',
 *      header: '可更新标题',
 *      contentRenderer: ({ options, index }) => h('div', '内容')
 *    })
 *    // 更新标题
 *    updateDialog('新标题', 'header', index)
 *
 * 10. 按钮关闭对话框：
 *     const dialogIndex = dialogStore.value.length
 *     addDialog({
 *       type: 'dialog',
 *       header: '标题',
 *       footerButtons: [
 *         {
 *           label: '关闭',
 *           severity: 'primary',
 *           btnClick: () => closeDialog(dialogIndex)
 *         }
 *       ]
 *     })
 *
 * 注意：关闭对话框时会先设置 visible: false 触发关闭动画，
 * 然后延时移除对话框，确保动画效果正常显示。
 */
