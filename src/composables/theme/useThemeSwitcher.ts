/**
 * @copyright Copyright (c) 2025 chichuang
 * @license MIT
 * @description cc-admin 企业级后台管理框架 - 主题切换工具函数
 * 本文件为 chichuang 原创，禁止擅自删除署名或用于商业用途。
 */

import { useColorStore } from '@/stores/modules/color'
import { computed, watch } from 'vue'

/**
 * 主题切换工具函数
 */
export function useThemeSwitcher() {
  const colorStore = useColorStore()

  // 获取当前主题
  const currentTheme = computed(() => colorStore.getThemeValue)

  // 获取当前模式
  const currentMode = computed(() => colorStore.getMode)

  // 是否为暗色模式
  const isDark = computed(() => colorStore.isDark)

  // 切换主题
  const switchTheme = (theme: string) => {
    try {
      colorStore.setTheme(theme)
      console.log(`主题已切换到: ${theme}`)
    } catch (error) {
      console.error('切换主题失败:', error)
    }
  }

  // 切换明暗模式
  const toggleMode = () => {
    try {
      colorStore.toggleMode()
      console.log(`模式已切换到: ${colorStore.getMode}`)
    } catch (error) {
      console.error('切换模式失败:', error)
    }
  }

  // 设置模式
  const setMode = (mode: 'light' | 'dark' | 'auto') => {
    try {
      colorStore.setMode(mode)
      console.log(`模式已设置为: ${mode}`)
    } catch (error) {
      console.error('设置模式失败:', error)
    }
  }

  // 获取可用主题列表
  const getAvailableThemes = () => {
    const themeOptions = colorStore.getThemeOptions
    return themeOptions.map(theme => theme.value)
  }

  // 获取可用模式列表
  const getAvailableModes = () => {
    return ['light', 'dark', 'auto'] as const
  }

  // 检查主题是否可用
  const isThemeAvailable = (theme: string) => {
    return getAvailableThemes().includes(theme)
  }

  // 检查模式是否可用
  const isModeAvailable = (mode: string) => {
    return getAvailableModes().includes(mode as any)
  }

  // 重置为主题默认值
  const resetToDefault = () => {
    try {
      colorStore.setTheme('default')
      colorStore.setMode('light')
      console.log('已重置为默认主题')
    } catch (error) {
      console.error('重置主题失败:', error)
    }
  }

  // 监听主题变化
  const onThemeChange = (callback: (theme: string) => void) => {
    watch(currentTheme, newTheme => {
      callback(newTheme)
    })
  }

  // 监听模式变化
  const onModeChange = (callback: (mode: string) => void) => {
    watch(currentMode, newMode => {
      callback(newMode)
    })
  }

  // 监听暗色模式变化
  const onDarkModeChange = (callback: (isDark: boolean) => void) => {
    watch(isDark, newIsDark => {
      callback(newIsDark)
    })
  }

  // 获取主题配置信息
  const getThemeInfo = (theme?: string) => {
    const targetTheme = theme || currentTheme.value
    return {
      name: targetTheme,
      isAvailable: isThemeAvailable(targetTheme),
      isCurrent: targetTheme === currentTheme.value,
    }
  }

  // 获取模式配置信息
  const getModeInfo = (mode?: string) => {
    const targetMode = mode || currentMode.value
    return {
      name: targetMode,
      isAvailable: isModeAvailable(targetMode),
      isCurrent: targetMode === currentMode.value,
      isDark: targetMode === 'dark' || (targetMode === 'auto' && isDark.value),
    }
  }

  return {
    // 基础功能
    switchTheme,
    toggleMode,
    setMode,
    resetToDefault,

    // 状态获取
    currentTheme,
    currentMode,
    isDark,

    // 工具函数
    getAvailableThemes,
    getAvailableModes,
    isThemeAvailable,
    isModeAvailable,
    getThemeInfo,
    getModeInfo,

    // 监听器
    onThemeChange,
    onModeChange,
    onDarkModeChange,
  }
}
