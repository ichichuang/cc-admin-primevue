/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 主题类型声明
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 声明全局类型
declare global {
  /* ==================== 主题模式相关类型 ==================== */

  /* 主题模式选项类型 */
  type Mode = 'light' | 'dark' | 'auto'

  interface ModeOptions {
    label: string
    value: Mode
  }

  /* ==================== 颜色相关类型 ==================== */

  /* 功能颜色定义 */
  interface FunctionalColors {
    // PrimeVue 设计令牌系统需要的核心属性
    color: string // 主色
    hover: string // hover背景色
    active: string // active背景色
    disabled: string // 禁用状态背景色
    text: string // 文本颜色
    border: string // 边框颜色
  }

  interface FunctionalColor {
    primary: FunctionalColors // 主色
    secondary: FunctionalColors // 次要色
    success: FunctionalColors // 成功色
    info: FunctionalColors // 信息色
    warn: FunctionalColors // 警告色
    help: FunctionalColors // 帮助色
    danger: FunctionalColors // 危险色
    contrast: FunctionalColors // 对比色
  }

  interface ThemeColors {
    // 主题色
    primary100: string // 主色深色调 - 用于主要按钮、导航栏、重要操作元素
    primary200: string // 主色中色调 - 用于悬停状态、次要强调、链接颜色
    primary300: string // 主色浅色调 - 用于背景渐变、轻微强调、选中状态背景
    primary400: string // 主色文字色 - 用于主色作为背景色时的文字颜色
    // 强调色
    accent100: string // 强调色主色调 - 用于重要信息提示、数据突出显示
    accent200: string // 强调色深色调 - 用于强调元素的深色变体、阴影效果
    // 文本色
    text100: string // 主文本色 - 用于标题、重要文字、主要内容文本
    text200: string // 次文本色 - 用于描述文字、辅助信息、次要内容
    // 背景色
    bg100: string // 主背景色 - 用于页面主背景、卡片背景、模态框背景
    bg200: string // 次背景色 - 用于区域分割、输入框背景、次要面板
    bg300: string // 边界背景色 - 用于分割线、禁用状态、边框颜色
    // 功能色
    functionalColors: FunctionalColor // 功能色
  }

  interface ThemeColor {
    label: string // 主题色标签
    value: string // 主题色值
    themeColors: ThemeColors // 主题色具体颜色配置
  }

  /* ==================== 尺寸相关类型 ==================== */

  /* 尺寸模式类型 宽松尺寸 > 舒适尺寸 > 紧凑尺寸 */
  type Size = 'compact' | 'comfortable' | 'loose'

  interface SizeOptions {
    label: string
    value: Size
  }

  /* 容器内外边距定义 */
  type Padding = [
    {
      label: '小'
      key: 'sm'
    },
    {
      label: '中'
      key: 'md'
    },
    {
      label: '大'
      key: 'lg'
    },
  ]

  interface PaddingOptions {
    label: Padding[number]['label']
    key: Padding[number]['key']
    value: number
  }

  /* 圆角定义 */
  type Rounded = [
    {
      label: '尖锐'
      key: 'sharp'
    },
    {
      label: '平滑'
      key: 'smooth'
    },
    {
      label: '圆滑'
      key: 'round'
    },
    {
      label: '圆润'
      key: 'soft'
    },
  ]

  interface RoundedOptions {
    label: Rounded[number]['label']
    key: Rounded[number]['key']
    value: number
  }

  /* 字体尺寸定义 */
  type FontSize = [
    {
      label: '迷你'
      key: 'xs'
    },
    {
      label: '小号'
      key: 'sm'
    },
    {
      label: '中号'
      key: 'md'
    },
    {
      label: '大号'
      key: 'lg'
    },
    {
      label: '特大号'
      key: 'xl'
    },
    {
      label: '超特大号'
      key: 'xls'
    },
    {
      label: '超超特大号'
      key: 'xxl'
    },
    {
      label: '超超超特大号'
      key: 'xxxl'
    },
  ]

  interface FontSizeOptions {
    label: FontSize[number]['label']
    key: FontSize[number]['key']
    value: number
  }

  /* 布局尺寸定义 */
  interface Layout {
    // 侧边栏宽度
    sidebarWidth: number
    // 侧边栏折叠宽度
    sidebarCollapsedWidth: number
    // 头部高度
    headerHeight: number
    // 面包屑高度
    breadcrumbHeight: number
    // 底部高度
    footerHeight: number
    // 标签页高度
    tabsHeight: number
    // 内容区域高度(不包含头部、面包屑、标签页、底部)
    contentHeight: number
    // 内容区域高度(不包含头部、底部)
    contentsHeight: number
    // 间距
    gap: number
  }

  /* ==================== 状态管理相关类型 ==================== */

  /* 颜色状态接口 */
  interface ColorState {
    // 颜色模式
    mode: Mode
    modeOptions: ModeOptions[]
    darkMode: boolean

    // 浅色模式主题
    lightThemeValue: ThemeColor['value']
    // 深色模式主题
    darkThemeValue: ThemeColor['value']

    // 监听系统主题变化
    mediaQueryListener?: ((e: MediaQueryListEvent) => void) | null
    mediaQuery?: MediaQueryList | null
  }

  /* 尺寸状态接口 */
  interface SizeState {
    size: SizeOptions['value']
    sizeOptions: SizeOptions[]
    sizes: Layout
    padding: PaddingOptions['key']
    paddingOptions: PaddingOptions[]
    rounded: RoundedOptions['key']
    roundedOptions: RoundedOptions[]
    fontSize: FontSizeOptions['key']
    fontSizeOptions: FontSizeOptions[]
  }

  /* ==================== 工具函数类型 ==================== */

  /* 创建功能颜色的函数类型 */
  type CreateFunctionalColors = (primaryColor: {
    color: string
    hover: string
    active: string
    disabled: string
    text: string
    border: string
  }) => FunctionalColor

  /* 获取主题选项的函数类型 */
  type GetThemeOptions = (isDark: boolean) => ThemeColor[]

  /* 根据主题值获取主题配置的函数类型 */
  type GetThemeByValue = (value: string, isDark: boolean) => ThemeColor | undefined

  /* 获取默认主题的函数类型 */
  type GetDefaultTheme = (isDark: boolean) => ThemeColor
}

// 导出空对象使其成为外部模块
export {}
