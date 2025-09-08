<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { OverlayScrollbars } from 'overlayscrollbars'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  defaultColorScheme,
  defaultOverlayScrollbarsOptions,
  defaultProps,
  getDeviceConfig,
  mergeOptions,
} from './utils/constants'
import type { Rect, ScrollbarExposed, ScrollbarWrapperProps, ScrollEvent } from './utils/types'

const layoutStore = useLayoutStore()

// 定义属性和默认值
const props = withDefaults(defineProps<ScrollbarWrapperProps>(), {
  ...defaultProps,
  style: () => ({}),
  wrapperStyle: () => ({}),
  contentStyle: () => ({}),
  colorScheme: () => defaultColorScheme,
  options: () => ({}),
})

// 组件引用
const overlayScrollbarsRef = ref<any>()

// 动态计算滚动条配置
const computedScrollbarConfig = computed<any>(() => {
  try {
    const isMobile = layoutStore.getIsMobile
    const deviceConfig = getDeviceConfig(isMobile)

    // 基础配置
    const baseConfig = {
      ...defaultOverlayScrollbarsOptions,
      scrollbars: {
        ...defaultOverlayScrollbarsOptions.scrollbars,
        autoHide:
          typeof props.autoHide === 'boolean'
            ? props.autoHide
              ? 'leave'
              : 'never'
            : props.autoHide || 'leave',
        autoHideDelay: props.autoHideDelay || 0,
        clickScroll: props.clickScroll !== (false as any),
        clickScrollStep: props.clickScrollStep || 1,
        clickScrollDuration: props.clickScrollDuration || 300,
        clickScrollEasing: props.clickScrollEasing || 'ease-out',
        // 添加缺失的配置项
        autoExpand: props.autoExpand !== false,
        fixedThumb: props.fixedThumb || false,
        simulateScroll: props.simulateScroll || false,
      },
      overflow: {
        x: props.direction === 'vertical' ? 'hidden' : ('scroll' as any),
        y: props.direction === 'horizontal' ? 'hidden' : ('scroll' as any),
      },
    }

    // 动态尺寸配置
    if (props.size > 0) {
      // 使用自定义尺寸 - 通过 CSS 变量控制，不直接设置到 scrollbars 配置中
      baseConfig.scrollbars = {
        ...baseConfig.scrollbars,
        // size 等属性通过 CSS 变量控制，不直接设置到 OverlayScrollbars 配置中
      }
    } else {
      // 使用设备配置
      baseConfig.scrollbars = {
        ...baseConfig.scrollbars,
        ...deviceConfig,
      }
    }

    // 合并自定义选项
    const mergedConfig = mergeOptions(baseConfig, props.options)

    return mergedConfig
  } catch (error) {
    console.warn('ScrollbarWrapper: 计算滚动条配置失败', error)
    return defaultOverlayScrollbarsOptions
  }
})

// 定义事件
const emit = defineEmits<{
  'wrapper-resize': [rect: Rect]
  'content-resize': [rect: Rect]
  scroll: [event: ScrollEvent]
  'scroll-horizontal': [event: ScrollEvent]
  'scroll-vertical': [event: ScrollEvent]
  'scroll-start': []
  'scroll-end': []
  initialized: [instance: OverlayScrollbars]
  updated: [instance: OverlayScrollbars]
  destroyed: []
}>()

// 合并颜色方案
const mergedColorScheme = computed(() => {
  try {
    // 直接使用默认颜色方案，不区分深色浅色模式
    return {
      ...defaultColorScheme,
      ...props.colorScheme,
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: 合并颜色方案失败', error)
    return defaultColorScheme
  }
})

// 计算滚动条尺寸
const scrollbarSize = computed(() => {
  try {
    if (props.size > 0) {
      return `${props.size}px`
    }
    const isMobile = layoutStore.getIsMobile
    const deviceConfig = getDeviceConfig(isMobile)
    return `${deviceConfig.size}px`
  } catch (error) {
    console.warn('ScrollbarWrapper: 计算滚动条尺寸失败', error)
    return '10px'
  }
})

// 计算滚动条填充
const scrollbarPaddingPerpendicular = computed(() => {
  try {
    if (props.paddingPerpendicular > 0) {
      return `${props.paddingPerpendicular}px`
    }
    const isMobile = layoutStore.getIsMobile
    const deviceConfig = getDeviceConfig(isMobile)
    return `${deviceConfig.paddingPerpendicular}px`
  } catch (error) {
    console.warn('ScrollbarWrapper: 计算滚动条填充失败', error)
    return '0px'
  }
})

const scrollbarPaddingAxis = computed(() => {
  try {
    if (props.paddingAxis > 0) {
      return `${props.paddingAxis}px`
    }
    const isMobile = layoutStore.getIsMobile
    const deviceConfig = getDeviceConfig(isMobile)
    return `${deviceConfig.paddingAxis}px`
  } catch (error) {
    console.warn('ScrollbarWrapper: 计算滚动条填充失败', error)
    return '0px'
  }
})

// 滚动状态管理
let scrollTimer: NodeJS.Timeout | null = null
let lastScrollLeft = 0
let lastScrollTop = 0
let isScrolling = false

// 节流函数
const throttle = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout | null = null
  return function (this: any, ...args: any[]) {
    const context = this as any
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        try {
          func.apply(context, args)
        } catch (error) {
          console.warn('ScrollbarWrapper: throttle 函数执行失败', error)
        }
      }, wait)
    }
  }
}

// 防抖函数
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout | null = null
  return function (this: any, ...args: any[]) {
    const context = this as any
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      timeout = null
      try {
        func.apply(context, args)
      } catch (error) {
        console.warn('ScrollbarWrapper: debounce 函数执行失败', error)
      }
    }, wait)
  }
}

// 获取节流/防抖函数
const getThrottleFunction = () => {
  const wait = props.throttleWait || 333
  switch (props.throttleType) {
    case 'throttle':
      return (func: (...args: any[]) => void) => throttle(func, wait)
    case 'debounce':
      return (func: (...args: any[]) => void) => debounce(func, wait)
    case 'none':
    default:
      return (func: (...args: any[]) => void) => func
  }
}

// 处理滚动事件
const handleScroll = getThrottleFunction()((event: Event) => {
  try {
    const scrollEl = event.target as HTMLElement
    if (!scrollEl) {
      return
    }

    const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollEl

    // 计算滚动方向和距离
    const deltaX = scrollLeft - lastScrollLeft
    const deltaY = scrollTop - lastScrollTop

    // 确定滚动方向
    let direction: 'horizontal' | 'vertical' | 'both' = 'both'
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = 'horizontal'
    } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
      direction = 'vertical'
    }

    // 构造滚动事件数据
    const scrollEventData: ScrollEvent = {
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight,
      direction,
      deltaX,
      deltaY,
    }

    // 触发滚动开始事件（仅在第一次滚动时触发）
    if (!isScrolling && (deltaX !== 0 || deltaY !== 0)) {
      isScrolling = true
      emit('scroll-start')
    }

    // 清除之前的定时器
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }

    // 抛出通用滚动事件
    emit('scroll', scrollEventData)

    // 根据主要滚动方向抛出对应事件
    if (deltaX !== 0) {
      emit('scroll-horizontal', scrollEventData)
    }
    if (deltaY !== 0) {
      emit('scroll-vertical', scrollEventData)
    }

    // 设置滚动结束检测定时器
    scrollTimer = setTimeout(() => {
      if (isScrolling) {
        isScrolling = false
        emit('scroll-end')
      }
    }, 150) // 150ms 后认为滚动结束

    // 更新上次滚动位置
    lastScrollLeft = scrollLeft
    lastScrollTop = scrollTop
  } catch (error) {
    console.warn('ScrollbarWrapper: 处理滚动事件失败', error)
  }
}) // 使用动态节流配置

// 处理尺寸变化事件
const handleWrapperResize = (rect: Rect) => {
  try {
    emit('wrapper-resize', rect)
  } catch (error) {
    console.warn('ScrollbarWrapper: wrapper-resize 事件处理失败', error)
  }
}

const handleContentResize = (rect: Rect) => {
  try {
    emit('content-resize', rect)
  } catch (error) {
    console.warn('ScrollbarWrapper: content-resize 事件处理失败', error)
  }
}

// OverlayScrollbars 事件处理器
const handleInitialized = (instance: OverlayScrollbars) => {
  try {
    emit('initialized', instance)

    // 立即添加滚动监听器
    nextTick(() => {
      addScrollListener()
    })

    // 初始化滚动位置
    const viewport = instance.elements().viewport
    if (viewport) {
      lastScrollLeft = viewport.scrollLeft
      lastScrollTop = viewport.scrollTop
    }

    // 调试：检查滚动条元素和CSS变量
    nextTick(() => {
      // 确保CSS变量正确应用到滚动条元素
      const wrapperEl = overlayScrollbarsRef.value?.$el
      if (wrapperEl) {
        const scrollbarEls = wrapperEl.querySelectorAll('.os-scrollbar')
        scrollbarEls.forEach((scrollbarEl: Element) => {
          const htmlEl = scrollbarEl as HTMLElement
          htmlEl.style.setProperty('--os-thumb-bg', mergedColorScheme.value.thumbColor)
          htmlEl.style.setProperty('--os-thumb-bg-hover', mergedColorScheme.value.thumbHoverColor)
          htmlEl.style.setProperty('--os-thumb-bg-active', mergedColorScheme.value.thumbActiveColor)
          htmlEl.style.setProperty('--os-track-bg', mergedColorScheme.value.trackColor)
          htmlEl.style.setProperty('--os-track-bg-hover', mergedColorScheme.value.trackHoverColor)
          htmlEl.style.setProperty('--os-track-bg-active', mergedColorScheme.value.trackActiveColor)

          // 直接设置尺寸相关的 CSS 变量
          htmlEl.style.setProperty('--os-size', scrollbarSize.value)
          htmlEl.style.setProperty(
            '--os-padding-perpendicular',
            scrollbarPaddingPerpendicular.value
          )
          htmlEl.style.setProperty('--os-padding-axis', scrollbarPaddingAxis.value)
        })

        // 直接设置滚动条滑块和轨道的样式
        const handleEls = wrapperEl.querySelectorAll('.os-scrollbar-handle')
        handleEls.forEach((handleEl: Element) => {
          const htmlEl = handleEl as HTMLElement
          htmlEl.style.setProperty(
            'background-color',
            mergedColorScheme.value.thumbColor,
            'important'
          )
          htmlEl.style.setProperty('background', mergedColorScheme.value.thumbColor, 'important')
        })

        const trackEls = wrapperEl.querySelectorAll('.os-scrollbar-track')
        trackEls.forEach((trackEl: Element) => {
          const htmlEl = trackEl as HTMLElement
          htmlEl.style.setProperty(
            'background-color',
            mergedColorScheme.value.trackColor,
            'important'
          )
          htmlEl.style.setProperty('background', mergedColorScheme.value.trackColor, 'important')
        })
      }
    })

    // 添加尺寸监听器
    if (typeof ResizeObserver !== 'undefined') {
      const wrapperEl = overlayScrollbarsRef.value?.$el
      const contentEl = instance.elements().content

      if (wrapperEl) {
        const wrapperObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const rect = entry.contentRect
            handleWrapperResize({
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
              x: rect.x,
              y: rect.y,
            })
          }
        })
        wrapperObserver.observe(wrapperEl)
      }

      if (contentEl) {
        const contentObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const rect = entry.contentRect
            handleContentResize({
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
              x: rect.x,
              y: rect.y,
            })
          }
        })
        contentObserver.observe(contentEl)
      }
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: initialized 事件处理失败', error)
  }
}

const handleUpdated = (instance: OverlayScrollbars) => {
  try {
    emit('updated', instance)
  } catch (error) {
    console.warn('ScrollbarWrapper: updated 事件处理失败', error)
  }
}

const handleDestroyed = () => {
  try {
    emit('destroyed')
  } catch (error) {
    console.warn('ScrollbarWrapper: destroyed 事件处理失败', error)
  }
}

// 获取 OverlayScrollbars 实例
const getOverlayScrollbars = (): OverlayScrollbars | null => {
  try {
    return overlayScrollbarsRef.value?.osInstance() || null
  } catch (error) {
    console.warn('ScrollbarWrapper: 获取 OverlayScrollbars 实例失败', error)
    return null
  }
}

// 获取滚动元素（视口元素）
const getScrollEl = (): HTMLElement | null => {
  try {
    const instance = getOverlayScrollbars()
    if (instance) {
      return instance.elements().viewport
    }
    return null
  } catch (error) {
    console.warn('ScrollbarWrapper: 获取滚动元素失败', error)
    return null
  }
}

// 获取视口元素
const getViewport = (): HTMLElement | null => {
  try {
    const instance = getOverlayScrollbars()
    if (instance) {
      return instance.elements().viewport
    }
    return null
  } catch (error) {
    console.warn('ScrollbarWrapper: 获取视口元素失败', error)
    return null
  }
}

// 获取内容元素
const getContent = (): HTMLElement | null => {
  try {
    const instance = getOverlayScrollbars()
    if (instance) {
      return instance.elements().content
    }
    return null
  } catch (error) {
    console.warn('ScrollbarWrapper: 获取内容元素失败', error)
    return null
  }
}

// 滚动方法
const scrollTo = (options: ScrollToOptions) => {
  try {
    const scrollEl = getScrollEl()
    if (scrollEl) {
      scrollEl.scrollTo(options)
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: scrollTo 失败', error)
  }
}

const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  scrollTo({ top: 0, behavior })
}

const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  try {
    const scrollEl = getScrollEl()
    if (scrollEl) {
      scrollTo({ top: scrollEl.scrollHeight, behavior })
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: scrollToBottom 失败', error)
  }
}

const scrollToLeft = (behavior: ScrollBehavior = 'smooth') => {
  scrollTo({ left: 0, behavior })
}

const scrollToRight = (behavior: ScrollBehavior = 'smooth') => {
  try {
    const scrollEl = getScrollEl()
    if (scrollEl) {
      scrollTo({ left: scrollEl.scrollWidth, behavior })
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: scrollToRight 失败', error)
  }
}

// 更新 OverlayScrollbars 选项
const updateOptions = (options: any) => {
  try {
    const instance = getOverlayScrollbars()
    if (instance) {
      instance.options(options)
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: 更新选项失败', error)
  }
}

// 销毁 OverlayScrollbars 实例
const destroy = () => {
  try {
    const instance = getOverlayScrollbars()
    if (instance) {
      instance.destroy()
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: 销毁实例失败', error)
  }
}

// 添加滚动事件监听器
const addScrollListener = () => {
  try {
    const scrollEl = getScrollEl()
    if (scrollEl) {
      // 初始化滚动位置
      lastScrollLeft = scrollEl.scrollLeft
      lastScrollTop = scrollEl.scrollTop

      // 使用 passive: true 监听 scroll，确保事件能及时触发
      scrollEl.addEventListener('scroll', handleScroll, { passive: true })
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: 添加滚动监听器失败', error)
  }
}

// 移除滚动事件监听器
const removeScrollListener = () => {
  try {
    const scrollEl = getScrollEl()
    if (scrollEl) {
      scrollEl.removeEventListener('scroll', handleScroll)
    }
  } catch (error) {
    console.warn('ScrollbarWrapper: 移除滚动监听器失败', error)
  }

  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
}

// 监听配置变化
watch(
  () => computedScrollbarConfig.value,
  newConfig => {
    nextTick(() => {
      updateOptions(newConfig)
    })
  },
  { deep: true }
)

// 监听颜色方案变化
watch(
  () => mergedColorScheme.value,
  newColorScheme => {
    nextTick(() => {
      const wrapperEl = overlayScrollbarsRef.value?.$el
      if (wrapperEl) {
        const scrollbarEls = wrapperEl.querySelectorAll('.os-scrollbar')
        scrollbarEls.forEach((scrollbarEl: Element) => {
          const htmlEl = scrollbarEl as HTMLElement
          htmlEl.style.setProperty('--os-thumb-bg', newColorScheme.thumbColor)
          htmlEl.style.setProperty('--os-thumb-bg-hover', newColorScheme.thumbHoverColor)
          htmlEl.style.setProperty('--os-thumb-bg-active', newColorScheme.thumbActiveColor)
          htmlEl.style.setProperty('--os-track-bg', newColorScheme.trackColor)
          htmlEl.style.setProperty('--os-track-bg-hover', newColorScheme.trackHoverColor)
          htmlEl.style.setProperty('--os-track-bg-active', newColorScheme.trackActiveColor)

          // 同时更新尺寸相关的 CSS 变量
          htmlEl.style.setProperty('--os-size', scrollbarSize.value)
          htmlEl.style.setProperty(
            '--os-padding-perpendicular',
            scrollbarPaddingPerpendicular.value
          )
          htmlEl.style.setProperty('--os-padding-axis', scrollbarPaddingAxis.value)
        })

        // 直接设置滚动条滑块和轨道的样式
        const handleEls = wrapperEl.querySelectorAll('.os-scrollbar-handle')
        handleEls.forEach((handleEl: Element) => {
          const htmlEl = handleEl as HTMLElement
          htmlEl.style.setProperty('background-color', newColorScheme.thumbColor, 'important')
          htmlEl.style.setProperty('background', newColorScheme.thumbColor, 'important')
        })

        const trackEls = wrapperEl.querySelectorAll('.os-scrollbar-track')
        trackEls.forEach((trackEl: Element) => {
          const htmlEl = trackEl as HTMLElement
          htmlEl.style.setProperty('background-color', newColorScheme.trackColor, 'important')
          htmlEl.style.setProperty('background', newColorScheme.trackColor, 'important')
        })
      }
    })
  },
  { deep: true }
)

// 监听尺寸变化
watch(
  () => [scrollbarSize.value, scrollbarPaddingPerpendicular.value, scrollbarPaddingAxis.value],
  ([newSize, newPaddingPerpendicular, newPaddingAxis]) => {
    nextTick(() => {
      const wrapperEl = overlayScrollbarsRef.value?.$el
      if (wrapperEl) {
        const scrollbarEls = wrapperEl.querySelectorAll('.os-scrollbar')
        scrollbarEls.forEach((scrollbarEl: Element) => {
          const htmlEl = scrollbarEl as HTMLElement
          htmlEl.style.setProperty('--os-size', newSize)
          htmlEl.style.setProperty('--os-padding-perpendicular', newPaddingPerpendicular)
          htmlEl.style.setProperty('--os-padding-axis', newPaddingAxis)
        })
      }
    })
  },
  { deep: true }
)

// 生命周期钩子
onMounted(() => {
  // 滚动监听器现在在 handleInitialized 中添加，确保 OverlayScrollbars 完全初始化后再添加
})

onUnmounted(() => {
  try {
    removeScrollListener()
    destroy()
  } catch (error) {
    console.warn('ScrollbarWrapper: 清理失败', error)
  }
})

// 暴露给父组件的方法和属性
defineExpose<ScrollbarExposed>({
  overlayScrollbarsRef,
  getOverlayScrollbars,
  getScrollEl,
  getViewport,
  getContent,
  scrollTo,
  scrollToTop,
  scrollToBottom,
  scrollToLeft,
  scrollToRight,
  addScrollListener,
  removeScrollListener,
  updateOptions,
  destroy,
})
</script>

<template>
  <div
    class="overlay-scrollbar-wrapper"
    :class="[props.direction === 'vertical' ? 'is-vertical' : 'is-horizontal', props.class]"
    :style="{
      // 颜色方案 - 使用正确的 CSS 变量名
      '--os-thumb-bg': mergedColorScheme.thumbColor,
      '--os-thumb-bg-hover': mergedColorScheme.thumbHoverColor,
      '--os-thumb-bg-active': mergedColorScheme.thumbActiveColor,
      '--os-track-bg': mergedColorScheme.trackColor,
      '--os-track-bg-hover': mergedColorScheme.trackHoverColor,
      '--os-track-bg-active': mergedColorScheme.trackActiveColor,
      '--os-thumb-border': mergedColorScheme.borderColor,
      '--os-thumb-border-hover': mergedColorScheme.borderHoverColor,
      '--os-thumb-border-active': mergedColorScheme.borderActiveColor,

      // 尺寸配置 - 使用正确的 CSS 变量名
      '--os-size': scrollbarSize,
      '--os-padding-perpendicular': scrollbarPaddingPerpendicular,
      '--os-padding-axis': scrollbarPaddingAxis,

      // 其他自定义样式
      ...props.style,
    }"
  >
    <!-- OverlayScrollbars 组件 -->
    <OverlayScrollbarsComponent
      class="full"
      ref="overlayScrollbarsRef"
      :options="computedScrollbarConfig"
      :class="props.wrapperClass"
      :style="props.wrapperStyle"
      @os-initialized="handleInitialized"
      @os-updated="handleUpdated"
      @os-destroyed="handleDestroyed"
      v-bind="$attrs"
    >
      <div
        class="full"
        :class="props.contentClass"
        :style="props.contentStyle"
      >
        <slot />
      </div>
    </OverlayScrollbarsComponent>
  </div>
</template>

<style lang="scss">
/* 基础滚动条样式 - 使用配置中的默认值 */
.os-scrollbar {
  padding: 0 !important;
  transition: all 0.4s ease !important;
}

.overlay-scrollbar-wrapper {
  background: transparent;
  width: 100%;
  height: 100%;
}

/* 根据方向设置滚动行为 */
.overlay-scrollbar-wrapper.is-vertical :deep(.os-scrollbar-horizontal) {
  display: none !important;
}

.overlay-scrollbar-wrapper.is-horizontal :deep(.os-scrollbar-vertical) {
  display: none !important;
}

/* 自定义 OverlayScrollbars 样式 - 使用动态 CSS 变量 */
.overlay-scrollbar-wrapper :deep(.os-scrollbar) {
  /* 尺寸配置 - 从父级继承变量值 */
  --os-size: inherit;
  --os-padding-perpendicular: inherit;
  --os-padding-axis: inherit;

  /* 轨道样式 - 使用配置中的默认值 */
  --os-track-border-radius: 0px;
  --os-track-border: transparent;
  --os-track-border-hover: transparent;
  --os-track-border-active: transparent;

  /* 滑块样式 - 使用配置中的默认值 */
  --os-thumb-border-radius: 0px;
  --os-thumb-min-size: 20px;
  --os-thumb-max-size: none;
}

/* 滚动条滑块样式 - 使用更具体的选择器 */
.overlay-scrollbar-wrapper :deep(.os-scrollbar-handle) {
  background-color: var(--os-thumb-bg) !important;
  border-radius: var(--os-thumb-border-radius) !important;
  border: var(--os-thumb-border) !important;
  min-width: var(--os-thumb-min-size) !important;
  min-height: var(--os-thumb-min-size) !important;
  max-width: var(--os-thumb-max-size) !important;
  max-height: var(--os-thumb-max-size) !important;
  transition: all 0.2s ease !important;
}

.overlay-scrollbar-wrapper :deep(.os-scrollbar-handle:hover) {
  background-color: var(--os-thumb-bg-hover) !important;
  border-color: var(--os-thumb-border-hover) !important;
}

.overlay-scrollbar-wrapper :deep(.os-scrollbar-handle:active) {
  background-color: var(--os-thumb-bg-active) !important;
  border-color: var(--os-thumb-border-active) !important;
}

/* 兼容性：同时支持 .os-scrollbar-thumb 选择器 */
.overlay-scrollbar-wrapper :deep(.os-scrollbar-thumb) {
  background-color: var(--os-thumb-bg) !important;
  border-radius: var(--os-thumb-border-radius) !important;
  border: var(--os-thumb-border) !important;
  min-width: var(--os-thumb-min-size) !important;
  min-height: var(--os-thumb-min-size) !important;
  max-width: var(--os-thumb-max-size) !important;
  max-height: var(--os-thumb-max-size) !important;
  transition: all 0.2s ease !important;
}

.overlay-scrollbar-wrapper :deep(.os-scrollbar-thumb:hover) {
  background-color: var(--os-thumb-bg-hover) !important;
  border-color: var(--os-thumb-border-hover) !important;
}

.overlay-scrollbar-wrapper :deep(.os-scrollbar-thumb:active) {
  background-color: var(--os-thumb-bg-active) !important;
  border-color: var(--os-thumb-border-active) !important;
}

/* 滚动条轨道样式 */
.overlay-scrollbar-wrapper :deep(.os-scrollbar-track) {
  background-color: var(--os-track-bg) !important;
  border-radius: var(--os-track-border-radius) !important;
  border: var(--os-track-border) !important;
  transition: all 0.2s ease !important;
}

.overlay-scrollbar-wrapper :deep(.os-scrollbar-track:hover) {
  background-color: var(--os-track-bg-hover) !important;
  border-color: var(--os-track-border-hover) !important;
}

.overlay-scrollbar-wrapper :deep(.os-scrollbar-track:active) {
  background-color: var(--os-track-bg-active) !important;
  border-color: var(--os-track-border-active) !important;
}

/* 视口样式 - 使用配置中的默认值 */
.overlay-scrollbar-wrapper :deep(.os-viewport) {
  overflow-x: var(--os-viewport-overflow-x, auto) !important;
  overflow-y: var(--os-viewport-overflow-y, auto) !important;
}

/* 内容区域样式 - 使用配置中的默认值 */
.overlay-scrollbar-wrapper :deep(.os-content) {
  padding: var(--os-content-padding, 0) !important;
}

/* 响应式设计 - 通过 props 动态控制，不再硬编码 */

/* 主题样式 - 通过 props.colorScheme 动态控制，不再硬编码 */
</style>
