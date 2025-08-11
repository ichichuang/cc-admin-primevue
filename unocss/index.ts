import extractorPug from '@unocss/extractor-pug'
import { defineConfig } from 'unocss'
import { contentConfig } from './config/content'
import { presets } from './presets'
import { rules } from './rules'
import { shortcuts } from './shortcuts'
import { transformers } from './transformers'
import { getDynamicSafelist } from './utils/icons'
import { themeConfig } from './utils/theme'
import { variants } from './variants'

export default defineConfig({
  // 内容扫描配置 - 优化性能
  content: contentConfig,

  // 使 UnoCSS 能正确从 Pug 模板中提取类名（支持 .class / #id 等简写）
  extractors: [extractorPug()],

  // 预设配置
  presets,

  // 安全列表 - 优化性能，只包含必要的类
  safelist: getDynamicSafelist(),

  // 变换器
  transformers,

  // 自定义变体 - 只保留实际使用的
  variants,

  // 快捷方式配置
  shortcuts: shortcuts as any,

  // 自定义规则
  rules,

  // 主题配置
  theme: themeConfig,
})
