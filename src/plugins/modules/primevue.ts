/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description PrimeVue 插件配置文件
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { useColorStore, useSizeStore } from '@/stores'
import PrimeVue from 'primevue/config'
import { watch, type App } from 'vue'
import { createPrimeVuePreset, updatePrimeVueTheme } from './primevue-theme'

/**
 * PrimeVue 配置选项
 */
export interface PrimeVueConfig {
  /** 主题预设 */
  preset?: any
  /** 组件前缀 */
  prefix?: string
  /** 暗色模式选择器 */
  darkModeSelector?: string
  /** CSS Layer 配置 */
  cssLayer?:
    | {
        name: string
        order: string
      }
    | boolean
}

/**
 * 默认 PrimeVue 配置
 */
const defaultConfig: PrimeVueConfig = {
  prefix: 'p',
  darkModeSelector: '.dark',
  cssLayer: {
    name: 'primevue',
    order: 'reset, primevue, cc-admin-custom',
  },
}

/**
 * 安装 PrimeVue 插件
 * @param app Vue 应用实例
 * @param config 自定义配置选项
 */
export function setupPrimeVue(app: App, config: Partial<PrimeVueConfig> = {}) {
  const finalConfig = {
    ...defaultConfig,
    ...config,
  }

  // 获取颜色存储实例
  const colorStore = useColorStore()
  const sizeStore = useSizeStore()

  // 创建动态主题预设
  const dynamicPreset = createPrimeVuePreset(colorStore, sizeStore)

  // 设置 PrimeVue
  app.use(PrimeVue, {
    theme: {
      preset: dynamicPreset,
      options: {
        prefix: finalConfig.prefix,
        darkModeSelector: finalConfig.darkModeSelector,
        cssLayer: finalConfig.cssLayer,
      },
    },
  })

  watch([colorStore, sizeStore], () => {
    updatePrimeVueTheme(colorStore, sizeStore)
  })
}

/**
 * 默认导出安装函数
 */
export default setupPrimeVue
