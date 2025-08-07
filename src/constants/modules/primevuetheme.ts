import { useColorStore, useSizeStore } from '@/stores'

/**
 * 主题配置缓存
 */
const themeCache = new Map<string, any>()

/**
 * 生成缓存键
 */
const generateCacheKey = (
  colorStore: ReturnType<typeof useColorStore>,
  sizeStore: ReturnType<typeof useSizeStore>
) => {
  const themeValue = colorStore.getThemeValue ?? 'default'
  const size = sizeStore.getSize ?? 'comfortable'
  const padding = sizeStore.getPadding ?? 'md'
  const rounded = sizeStore.getRounded ?? 'smooth'
  const fontSize = sizeStore.getFontSize ?? 'md'

  return `${themeValue}-${size}-${padding}-${rounded}-${fontSize}`
}

/**
 * 原地修改版本 - 直接修改原对象
 * @param target 目标对象（参数1）
 * @param styles 样式对象（参数2）
 * @returns 修改后的原对象引用
 */
export function deepMergeStylesInPlace<T = any>(target: T, styles: Record<string, any>): T {
  function traverse(obj: any): void {
    if (obj === null || typeof obj !== 'object') {
      return
    }

    for (const [key, value] of Object.entries(obj)) {
      // 检查当前key是否在样式对象中存在
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        // 如果当前值是对象且样式值也是对象，进行深度合并
        if (
          typeof value === 'object' &&
          value !== null &&
          typeof styles[key] === 'object' &&
          styles[key] !== null
        ) {
          obj[key] = { ...value, ...styles[key] }
        } else {
          // 直接赋值
          obj[key] = styles[key]
        }
      }

      // 递归处理嵌套对象
      if (typeof value === 'object' && value !== null) {
        traverse(value)
      }
    }
  }

  traverse(target)
  return target
}

/**
 * 高级版本 - 支持路径匹配和条件过滤
 * @param target 目标对象
 * @param styles 样式对象，支持点号分隔的路径语法，如 {'popover.color': 'red', 'popover.icon.color': 'blue'}
 * @param options 配置选项
 */
export interface MergeOptions {
  /** 是否深度合并对象值 */
  deepMerge?: boolean
  /** 是否覆盖已存在的值 */
  override?: boolean
  /** 自定义匹配函数 */
  matcher?: (key: string, value: any, path: string[]) => boolean
  /** 自定义转换函数 */
  transformer?: (key: string, oldValue: any, newValue: any) => any
}

export function deepMergeStylesAdvanced<T = any>(
  target: T,
  styles: Record<string, any>,
  options: MergeOptions = {}
): T {
  const { deepMerge = true, override = true, matcher, transformer } = options

  const result = JSON.parse(JSON.stringify(target))

  // 处理点号分隔的路径样式
  const processedStyles: Record<string, any> = {}
  const pathStyles: Record<string, any> = {}

  for (const [key, value] of Object.entries(styles)) {
    if (key.includes('.')) {
      // 点号分隔的路径样式
      pathStyles[key] = value
    } else {
      // 普通样式
      processedStyles[key] = value
    }
  }

  function traverse(obj: any, path: string[] = []): void {
    if (obj === null || typeof obj !== 'object') {
      return
    }

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key]
      const currentPathString = currentPath.join('.')

      // 检查是否匹配路径样式
      let matchedPathStyle = false
      let pathStyleValue: any = null

      for (const [pathKey, pathValue] of Object.entries(pathStyles)) {
        if (pathKey === currentPathString) {
          matchedPathStyle = true
          pathStyleValue = pathValue
          break
        }
      }

      // 动态处理任意 key 的路径样式
      if (typeof value === 'object' && value !== null) {
        for (const [pathKey, pathValue] of Object.entries(pathStyles)) {
          // 检查路径是否以当前 key 开头
          if (pathKey.startsWith(`${key}.`)) {
            const subPath = pathKey.substring(key.length + 1) // 移除 'key.' 前缀
            if (subPath) {
              // 处理多层路径，如 'content.padding'
              const pathParts = subPath.split('.')
              let currentObj = value as any
              let canSet = true

              // 遍历路径的每一部分，除了最后一部分
              for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i]
                if (Object.prototype.hasOwnProperty.call(currentObj, part)) {
                  currentObj = currentObj[part]
                  if (typeof currentObj !== 'object' || currentObj === null) {
                    canSet = false
                    break
                  }
                } else {
                  canSet = false
                  break
                }
              }

              // 如果路径存在，设置最后一个属性
              if (canSet && pathParts.length > 0) {
                const lastPart = pathParts[pathParts.length - 1]
                if (Object.prototype.hasOwnProperty.call(currentObj, lastPart)) {
                  // 检查是否应该覆盖
                  if (!override && currentObj[lastPart] !== undefined) {
                    continue
                  }
                  currentObj[lastPart] = pathValue
                }
              }
            }
          }
        }
      }

      // 自定义匹配逻辑
      const shouldMatch = matcher
        ? matcher(key, value, currentPath)
        : Object.prototype.hasOwnProperty.call(processedStyles, key) || matchedPathStyle

      if (shouldMatch) {
        const newValue = matchedPathStyle ? pathStyleValue : processedStyles[key]

        // 检查是否应该覆盖
        if (!override && obj[key] !== undefined) {
          continue
        }

        // 自定义转换
        if (transformer) {
          obj[key] = transformer(key, value, newValue)
        } else if (
          deepMerge &&
          typeof value === 'object' &&
          value !== null &&
          typeof newValue === 'object' &&
          newValue !== null
        ) {
          obj[key] = { ...value, ...newValue }
        } else {
          obj[key] = newValue
        }
      }

      // 递归处理嵌套对象
      if (typeof value === 'object' && value !== null) {
        traverse(value, currentPath)
      }
    }
  }

  traverse(result)
  return result
}

/**
 * PrimeVue主题配置接口
 */
export interface PrimeVueThemeConfig {
  colorStore: ReturnType<typeof useColorStore>
  sizeStore: ReturnType<typeof useSizeStore>
}

/**
 * 创建自定义主题预设
 * @param preset 原始预设
 * @param config 主题配置
 * @returns 自定义预设
 */
export const createCustomPreset = (preset: any, { colorStore, sizeStore }: PrimeVueThemeConfig) => {
  try {
    // 验证输入参数
    if (!colorStore || !sizeStore) {
      console.warn('createCustomPreset: colorStore 或 sizeStore 未提供')
      return preset
    }

    // 检查缓存
    const cacheKey = generateCacheKey(colorStore, sizeStore)
    if (themeCache.has(cacheKey)) {
      return themeCache.get(cacheKey)
    }

    // 自定义颜色配置
    const customColor = {
      shadow: `rgba(${colorStore.getAccent200}, 0.25) 0px 25px 50px -12px`,

      // 边框颜色
      borderColor: colorStore.getBg300, // 默认边框色
      hoverBorderColor: colorStore.getPrimary100, // 悬停时边框色
      focusBorderColor: colorStore.getBg100, // 聚焦时边框色
      invalidBorderColor: colorStore.getBg200, // 校验失败时边框色

      // 文字颜色
      color: colorStore.getText100, // 默认文字颜色
      contrastColor: colorStore.getBg100, // 文字对比色（通常用于浅色背景上的深色文字）
      hoverColor: colorStore.getPrimary100, // 悬停文字颜色
      activeColor: colorStore.getPrimary200, // 激活状态文字颜色
      disabledColor: colorStore.getBg300, // 禁用状态文字颜色
      placeholderColor: colorStore.getBg300, // 占位符文字颜色
      invalidPlaceholderColor: colorStore.getBg200, // 校验失败时占位符颜色
      focusColor: colorStore.getText100, // 聚焦状态文字颜色
      floatLabelColor: colorStore.getBg300, // 浮动标签颜色（未聚焦）
      floatLabelFocusColor: colorStore.getBg100, // 浮动标签聚焦颜色
      floatLabelActiveColor: colorStore.getBg300, // 浮动标签激活颜色
      floatLabelInvalidColor: colorStore.getBg200, // 浮动标签错误状态颜色
      selectedColor: colorStore.getPrimary200, // 选中项文字颜色
      selectedFocusColor: colorStore.getPrimary100, // 选中项聚焦时文字颜色

      // 背景色
      background: colorStore.getBg100, // 默认背景色
      hoverBackground: colorStore.getPrimary200, // 悬停时背景色
      disabledBackground: colorStore.getBg300, // 禁用状态背景色
      filledBackground: colorStore.getBg200, // 填充类型组件背景色
      filledHoverBackground: colorStore.getBg200, // 填充组件悬停背景色
      filledFocusBackground: colorStore.getBg200, // 填充组件聚焦背景色
      focusBackground: colorStore.getBg200, // 聚焦状态下背景色
      selectedBackground: colorStore.getBg200, // 被选中时背景色
      selectedFocusBackground: colorStore.getBg200, // 被选中聚焦时背景色

      // 图标颜色
      iconColor: colorStore.getText100, // 默认图标颜色
      icon: {
        color: colorStore.getText100, // 图标默认颜色
        focusColor: colorStore.getPrimary100, // 聚焦时图标颜色
        activeColor: colorStore.getPrimary200, // 激活状态图标颜色
      },
      submenuIcon: {
        color: colorStore.getText100, // 子菜单图标默认颜色
        focusColor: colorStore.getPrimary100, // 子菜单图标聚焦颜色
        activeColor: colorStore.getPrimary200, // 子菜单图标激活颜色
      },
    }

    // 自定义尺寸配置
    const customSize = {
      borderRadius: `${sizeStore.getRoundedValue}px`, // 圆角尺寸
      gap: `${sizeStore.getGap}px`, // 元素之间间距
      padding: `${sizeStore.getPaddingsValue}px ${sizeStore.getPaddingValue}px`, // 元素内边距（上下 左右）
      margin: `${sizeStore.getGap}px ${sizeStore.getGaps}px`, // 外边距（上下 左右）
      paddingX: `${sizeStore.getPaddingValue}px`, // 左右内边距
      paddingY: `${sizeStore.getPaddingsValue}px`, // 上下内边距
      marginX: `${sizeStore.getGap}px`, // 左右外边距
      marginY: `${sizeStore.getGaps}px`, // 上下外边距
    }

    // 路径样式，用于深度匹配
    const pathStyles: Record<string, any> = {
      // 弹出框
      ['popover.padding']: `${sizeStore.getPaddingxValue}px`,
      ['popover.content.padding']: `${sizeStore.getPaddingxValue}px`,
      ['popover.root.borderRadius']: `6px`,
      // 遮罩层
      ['mask.background']: `${colorStore.getBg200}80`,
    }

    const customPreset = {
      ...customColor,
      ...customSize,
    }

    // 先合并普通样式，再合并路径样式
    let newPreset = deepMergeStylesAdvanced(preset, customPreset, {
      deepMerge: true,
      override: true,
    })
    newPreset = deepMergeStylesAdvanced(newPreset, pathStyles, {
      deepMerge: true,
      override: true,
    })

    // 缓存结果
    if (cacheKey) {
      themeCache.set(cacheKey, newPreset)

      // 限制缓存大小，避免内存泄漏
      if (themeCache.size > 50) {
        const firstKey = themeCache.keys().next().value
        if (firstKey) {
          themeCache.delete(firstKey)
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 注入自定义主题配置:', newPreset)
    }

    return newPreset
  } catch (error) {
    console.error('createCustomPreset 执行失败:', error)
    return preset
  }
}

/**
 * 清理主题缓存
 */
export const clearThemeCache = () => {
  themeCache.clear()
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 主题缓存已清理')
  }
}
