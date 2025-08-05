/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - theme
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

// 类型定义
interface ThemeConfig {
  breakpoints: Record<string, string>
  colors: Record<string, any>
  sizes: Record<string, string>
}

/**
 * 主题配置
 * 与 color.ts 和 size.ts 保持完全一致
 */
export const themeConfig: ThemeConfig = {
  breakpoints: {
    xs: '375px',
    sm: '768px',
    md: '1024px',
    lg: '1400px',
    xl: '1660px',
    xls: '1920px',
    // 🎯 添加缺失的断点，与 REM 适配系统完全同步
    xxl: '2560px', // 超宽屏 (2560px+)
    xxxl: '3840px', // 4K屏 (3840px+)
  },

  colors: {
    // 透明色
    tm: 'transparent',
    // 继承色
    inherit: 'inherit',

    // 功能色系统 - 与 color.ts 保持完全一致
    primaryColor: 'var(--primary-color)',
    secondaryColor: 'var(--secondary-color)',
    successColor: 'var(--success-color)',
    infoColor: 'var(--info-color)',
    warnColor: 'var(--warn-color)',
    helpColor: 'var(--help-color)',
    dangerColor: 'var(--danger-color)',
    contrastColor: 'var(--contrast-color)',

    // 功能色 - 悬停状态
    primaryHoverColor: 'var(--primary-color-hover)',
    secondaryHoverColor: 'var(--secondary-color-hover)',
    successHoverColor: 'var(--success-color-hover)',
    infoHoverColor: 'var(--info-color-hover)',
    warnHoverColor: 'var(--warn-color-hover)',
    helpHoverColor: 'var(--help-color-hover)',
    dangerHoverColor: 'var(--danger-color-hover)',
    contrastHoverColor: 'var(--contrast-color-hover)',

    // 功能色 - 激活状态
    primaryActiveColor: 'var(--primary-color-active)',
    secondaryActiveColor: 'var(--secondary-color-active)',
    successActiveColor: 'var(--success-color-active)',
    infoActiveColor: 'var(--info-color-active)',
    warnActiveColor: 'var(--warn-color-active)',
    helpActiveColor: 'var(--help-color-active)',
    dangerActiveColor: 'var(--danger-color-active)',
    contrastActiveColor: 'var(--contrast-color-active)',

    // 功能色 - 禁用状态
    primaryDisabledColor: 'var(--primary-color-disabled)',
    secondaryDisabledColor: 'var(--secondary-color-disabled)',
    successDisabledColor: 'var(--success-color-disabled)',
    infoDisabledColor: 'var(--info-color-disabled)',
    warnDisabledColor: 'var(--warn-color-disabled)',
    helpDisabledColor: 'var(--help-color-disabled)',
    dangerDisabledColor: 'var(--danger-color-disabled)',
    contrastDisabledColor: 'var(--contrast-color-disabled)',

    // 功能色 - 文本颜色（替换原来的 light）
    primaryTextColor: 'var(--primary-color-text)',
    secondaryTextColor: 'var(--secondary-color-text)',
    successTextColor: 'var(--success-color-text)',
    infoTextColor: 'var(--info-color-text)',
    warnTextColor: 'var(--warn-color-text)',
    helpTextColor: 'var(--help-color-text)',
    dangerTextColor: 'var(--danger-color-text)',
    contrastTextColor: 'var(--contrast-color-text)',

    // 功能色 - 边框颜色
    primaryBorderColor: 'var(--primary-color-border)',
    secondaryBorderColor: 'var(--secondary-color-border)',
    successBorderColor: 'var(--success-color-border)',
    infoBorderColor: 'var(--info-color-border)',
    warnBorderColor: 'var(--warn-color-border)',
    helpBorderColor: 'var(--help-color-border)',
    dangerBorderColor: 'var(--danger-color-border)',
    contrastBorderColor: 'var(--contrast-color-border)',

    // 功能色 - 阴影效果
    primaryShadowColor: 'var(--primary-color-shadow)',
    secondaryShadowColor: 'var(--secondary-color-shadow)',
    successShadowColor: 'var(--success-color-shadow)',
    infoShadowColor: 'var(--info-color-shadow)',
    warnShadowColor: 'var(--warn-color-shadow)',
    helpShadowColor: 'var(--help-color-shadow)',
    dangerShadowColor: 'var(--danger-color-shadow)',
    contrastShadowColor: 'var(--contrast-color-shadow)',

    // 功能色 - 焦点效果
    primaryFocusColor: 'var(--primary-color-focus)',
    secondaryFocusColor: 'var(--secondary-color-focus)',
    successFocusColor: 'var(--success-color-focus)',
    infoFocusColor: 'var(--info-color-focus)',
    warnFocusColor: 'var(--warn-color-focus)',
    helpFocusColor: 'var(--help-color-focus)',
    dangerFocusColor: 'var(--danger-color-focus)',
    contrastFocusColor: 'var(--contrast-color-focus)',

    // 主题色系统
    primary100: 'var(--primary100)',
    primary200: 'var(--primary200)',
    primary300: 'var(--primary300)',

    // 强调色系统
    accent100: 'var(--accent100)',
    accent200: 'var(--accent200)',

    // 文本色系统
    text100: 'var(--text100)',
    text200: 'var(--text200)',

    // 背景色系统
    bg100: 'var(--bg100)',
    bg200: 'var(--bg200)',
    bg300: 'var(--bg300)',
  },

  sizes: {
    // 布局尺寸 - 与 size.ts 保持完全一致
    sidebarWidth: 'var(--sidebar-width)',
    sidebarCollapsedWidth: 'var(--sidebar-collapsed-width)',
    headerHeight: 'var(--header-height)',
    breadcrumbHeight: 'var(--breadcrumb-height)',
    footerHeight: 'var(--footer-height)',
    tabsHeight: 'var(--tabs-height)',
    contentHeight: 'var(--content-height)',
    contentsHeight: 'var(--contents-height)',

    // 间距系统
    gap: 'var(--gap)',
    gaps: 'var(--gaps)', // gap的一半，用于更精细的间距控制

    // 圆角系统
    rounded: 'var(--rounded)',
  },
}
