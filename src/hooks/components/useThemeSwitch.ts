import { useColorStore } from '@/stores'
import { computed, ref } from 'vue'

type ViewTransition = {
  ready: Promise<void>
  finished: Promise<void>
}

// 缓存计算半径的函数
const calculateRadius = (x: number, y: number): number => {
  const maxX = Math.max(x, window.innerWidth - x)
  const maxY = Math.max(y, window.innerHeight - y)
  return Math.hypot(maxX, maxY)
}

export const useThemeSwitch = () => {
  const colorStore = useColorStore()
  const isAnimating = ref(false)

  // 计算属性
  const modeOptions = computed(() => colorStore.getModeOptions)
  const mode = computed(() => colorStore.getMode)
  const isDark = computed(() => colorStore.isDark)

  // 设置模式
  const setMode = (value: Mode) => {
    colorStore.setMode(value)
  }

  // 获取下一个模式（排除 auto 自动模式）
  const getNextMode = () => {
    const newModeOptions = modeOptions.value.filter(item => item.value !== 'auto')
    const currentIndex = newModeOptions.findIndex(item => item.value === mode.value)
    const nextIndex = (currentIndex + 1) % newModeOptions.length
    return newModeOptions[nextIndex].value
  }

  // 获取下一个模式（包含 auto 自动模式）
  const getNextModeWithAuto = () => {
    const currentIndex = modeOptions.value.findIndex(item => item.value === mode.value)
    const nextIndex = (currentIndex + 1) % modeOptions.value.length
    return modeOptions.value[nextIndex].value
  }

  // 切换模式（排除 auto）
  const toggleMode = () => {
    const nextMode = getNextMode()
    setMode(nextMode)
  }

  // 切换模式（包含 auto）
  const toggleModeWithAuto = () => {
    const nextMode = getNextModeWithAuto()
    setMode(nextMode)
  }

  // 主题切换核心函数（带动画）
  const toggleThemeWithAnimation = async (
    event: MouseEvent,
    includeAuto: boolean = false,
    duration: number = 400
  ) => {
    // 防止动画期间重复点击
    if (isAnimating.value) {
      return
    }
    isAnimating.value = true

    // 获取当前状态（在 DOM 变化之前）
    const currentIsDark = isDark.value

    // 根据是否包含自适应模式，选择不同的切换函数
    const toggleFunction = includeAuto ? toggleModeWithAuto : toggleMode

    // 计算切换后的模式
    const nextMode = includeAuto ? getNextModeWithAuto() : getNextMode()
    const willBeDark =
      nextMode === 'dark' ||
      (nextMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    // 检查是否需要跳过动画
    // 当切换到自适应模式时，如果当前是深色且系统也是深色，则跳过动画
    const shouldSkipAnimation =
      nextMode === 'auto' &&
      currentIsDark &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    // 如果需要跳过动画，直接切换模式
    if (shouldSkipAnimation) {
      toggleFunction()
      isAnimating.value = false
      return
    }

    // 缓存动画配置
    const animationConfig = {
      duration: duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // 使用更平滑的缓动函数
    }

    // 如果浏览器不支持 startViewTransition，降级处理
    if (!document?.startViewTransition) {
      toggleFunction()
      isAnimating.value = false
      return
    }

    try {
      // 在切换前添加预处理类
      document.documentElement.classList.add('theme-transition')

      const transition = document.startViewTransition(async () => {
        toggleFunction()
      }) as ViewTransition

      await transition.ready
      const { clientX, clientY } = event
      const radius = calculateRadius(clientX, clientY)

      const clipPath = [
        `circle(0px at ${clientX}px ${clientY}px)`,
        `circle(${radius}px at ${clientX}px ${clientY}px)`,
      ]

      document.documentElement.animate(
        {
          clipPath: willBeDark ? clipPath.reverse() : clipPath,
        },
        {
          ...animationConfig,
          pseudoElement: willBeDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      )

      // 等待过渡完成后移除预处理类
      await transition.finished
      document.documentElement.classList.remove('theme-transition')
    } catch (error) {
      console.error('Theme transition failed:', error)
      toggleFunction()
      document.documentElement.classList.remove('theme-transition')
    } finally {
      isAnimating.value = false
    }
  }

  // 简单切换函数（无动画）
  const toggleTheme = (includeAuto: boolean = false) => {
    const toggleFunction = includeAuto ? toggleModeWithAuto : toggleMode
    toggleFunction()
  }

  // 设置特定模式（带动画）
  const setThemeWithAnimation = async (
    themeValue: string,
    event: MouseEvent,
    duration: number = 400
  ) => {
    // 防止动画期间重复点击
    if (isAnimating.value) {
      return
    }
    isAnimating.value = true

    // 获取当前状态（在 DOM 变化之前）
    const currentIsDark = isDark.value
    const willBeDark = themeValue === 'dark'

    console.log('Theme transition START:', {
      currentMode: currentIsDark ? 'dark' : 'light',
      targetMode: themeValue,
      willBeDark,
      hasViewTransitions: !!document?.startViewTransition,
    })

    // 缓存动画配置
    const animationConfig = {
      duration: duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // 使用更平滑的缓动函数
    }

    // 如果浏览器不支持 startViewTransition，降级处理
    if (!document?.startViewTransition) {
      setMode(themeValue as Mode)
      isAnimating.value = false
      return
    }

    try {
      // 在切换前添加预处理类
      document.documentElement.classList.add('theme-transition')

      const transition = document.startViewTransition(async () => {
        setMode(themeValue as Mode)
      }) as ViewTransition

      await transition.ready
      const { clientX, clientY } = event
      const radius = calculateRadius(clientX, clientY)

      const clipPath = [
        `circle(0px at ${clientX}px ${clientY}px)`,
        `circle(${radius}px at ${clientX}px ${clientY}px)`,
      ]

      document.documentElement.animate(
        {
          clipPath: willBeDark ? clipPath.reverse() : clipPath,
        },
        {
          ...animationConfig,
          pseudoElement: willBeDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      )

      // 等待过渡完成后移除预处理类
      await transition.finished
      document.documentElement.classList.remove('theme-transition')
    } catch (error) {
      console.error('Theme transition failed:', error)
      setMode(themeValue as Mode)
      document.documentElement.classList.remove('theme-transition')
    } finally {
      isAnimating.value = false
    }
  }

  return {
    // 状态
    isAnimating,
    isDark,
    mode,
    modeOptions,

    // 方法
    toggleThemeWithAnimation,
    toggleTheme,
    setThemeWithAnimation,
    setMode,
    toggleMode,
    toggleModeWithAuto,
    getNextMode,
    getNextModeWithAuto,
  }
}
