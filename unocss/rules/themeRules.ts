/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - themeRules
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

/**
 * 创建主题变量映射规则
 * 优化：支持动态主题变量
 *
 * 注意：CSS 变量不会被 postcss-pxtorem 处理，
 * 这些规则与 rem 适配系统完美兼容
 */
export function createThemeVariableRules() {
  const properties = [
    ['w', 'width'],
    ['h', 'height'],
    ['p', 'padding'],
    ['pt', 'padding-top'],
    ['pr', 'padding-right'],
    ['pb', 'padding-bottom'],
    ['pl', 'padding-left'],
    ['px', ['padding-left', 'padding-right']],
    ['py', ['padding-top', 'padding-bottom']],
    ['m', 'margin'],
    ['mt', 'margin-top'],
    ['mr', 'margin-right'],
    ['mb', 'margin-bottom'],
    ['ml', 'margin-left'],
    ['mx', ['margin-left', 'margin-right']],
    ['my', ['margin-top', 'margin-bottom']],
    ['t', 'top'],
    ['r', 'right'],
    ['b', 'bottom'],
    ['l', 'left'],
    ['gap', 'gap'],
    ['gapx', 'gap-x'],
    ['gapy', 'gap-y'],
    ['borderw', 'border-width'],
    ['rounded', 'border-radius'],
    ['fs', 'font-size'],
  ] as const

  return properties.map(([prefix, cssProperty]) => [
    new RegExp(`^${prefix}-(\\w+)$`),
    ([, name]: string[], { theme }: { theme: any }) => {
      // 首先检查主题配置中是否有对应的尺寸
      if (theme.sizes && theme.sizes[name]) {
        if (Array.isArray(cssProperty)) {
          return Object.fromEntries(cssProperty.map(prop => [prop as string, theme.sizes[name]]))
        }
        return { [cssProperty as string]: theme.sizes[name] }
      }

      // 如果没有找到主题配置，检查是否是布局相关的动态变量
      const layoutSizes = [
        'sidebarWidth',
        'sidebarCollapsedWidth',
        'headerHeight',
        'breadcrumbHeight',
        'footerHeight',
        'tabsHeight',
        'contentHeight',
        'contentsHeight',
      ]

      if (layoutSizes.includes(name)) {
        // 使用与 toKebabCase 函数一致的命名规则
        const cssVarName = `var(--${name.replace(/([A-Z])/g, '-$1').toLowerCase()})`
        if (Array.isArray(cssProperty)) {
          return Object.fromEntries(cssProperty.map(prop => [prop as string, cssVarName]))
        }
        return { [cssProperty as string]: cssVarName }
      }

      return undefined
    },
  ])
}
