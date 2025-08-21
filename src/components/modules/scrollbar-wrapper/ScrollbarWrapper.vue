<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import CustomScrollbar from 'custom-vue-scrollbar'
import type { ComponentPublicInstance } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { defaultColorScheme, defaultProps } from './utils/constants'
import type { Rect, ScrollbarProps } from './utils/types'

const layoutStore = useLayoutStore()

// 定义属性和默认值
const props = withDefaults(defineProps<ScrollbarProps>(), defaultProps)

// 组件引用
const scrollbarRef = ref<ComponentPublicInstance>()

// 动态计算滚动条宽度（thumbWidth）
const computedThumbWidth = computed(() => {
  if (props.thumbWidth && props.thumbWidth > 0) {
    return props.thumbWidth
  }

  // 根据设备类型和滚动方向动态计算滚动条宽度
  const isMobile = layoutStore.getIsMobile
  const deviceWidth = layoutStore.getWidth
  const deviceHeight = layoutStore.getHeight
  const verticalSize = isMobile ? Math.max(deviceWidth * 0.01, 8) : Math.max(deviceWidth * 0.01, 10)
  const horizontalSize = isMobile
    ? Math.max(deviceHeight * 0.01, 8)
    : Math.max(deviceHeight * 0.01, 10)
  if (props.direction === 'vertical') {
    return verticalSize
  } else {
    return horizontalSize
  }
})

// 定义滚动事件接口
interface ScrollEvent {
  scrollLeft: number
  scrollTop: number
  scrollWidth: number
  scrollHeight: number
  clientWidth: number
  clientHeight: number
  direction: 'horizontal' | 'vertical' | 'both'
  deltaX?: number
  deltaY?: number
}

// 定义事件
interface Emits {
  (e: 'wrapper-resize', rect: Rect): void
  (e: 'content-resize', rect: Rect): void
  (e: 'scroll', event: ScrollEvent): void
  (e: 'scroll-horizontal', event: ScrollEvent): void
  (e: 'scroll-vertical', event: ScrollEvent): void
  (e: 'scroll-start'): void
  (e: 'scroll-end'): void
}

const emit = defineEmits<Emits>()

// 合并颜色方案
const mergedColorScheme = computed(() => ({
  ...defaultColorScheme,
  ...props.colorScheme,
}))

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
        func.apply(context, args)
      }, wait)
    }
  }
}

// 处理滚动事件
const handleScroll = throttle((event: Event) => {
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

  // 触发滚动开始事件
  if (!isScrolling) {
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
}, 16) // 约60fps的节流

// 事件处理器
const handleWrapperResize = (rect: Rect) => {
  emit('wrapper-resize', rect)
}

const handleContentResize = (rect: Rect) => {
  emit('content-resize', rect)
}

// 暴露滚动元素的引用，方便外部调用原生滚动API
const getScrollEl = () => {
  const instance: any = scrollbarRef.value as any
  // 优先使用组件对外暴露的 scrollEl（custom-vue-scrollbar expose）
  const exposed = instance?.scrollEl
  if (exposed) {
    // 兼容可能是 Ref 或 原生元素的两种情况
    return exposed?.value ?? exposed
  }
  // 回退到通过 DOM 查询内部实际滚动容器
  return instance?.$el?.querySelector('.scrollbar__scroller') || null
}

// 暴露一些常用的滚动方法
const scrollTo = (options: ScrollToOptions) => {
  const scrollEl = getScrollEl()
  if (scrollEl) {
    scrollEl.scrollTo(options)
  }
}

const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  scrollTo({ top: 0, behavior })
}

const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  const scrollEl = getScrollEl()
  if (scrollEl) {
    scrollTo({ top: scrollEl.scrollHeight, behavior })
  }
}

const scrollToLeft = (behavior: ScrollBehavior = 'smooth') => {
  scrollTo({ left: 0, behavior })
}

const scrollToRight = (behavior: ScrollBehavior = 'smooth') => {
  const scrollEl = getScrollEl()
  if (scrollEl) {
    scrollTo({ left: scrollEl.scrollWidth, behavior })
  }
}

// 添加滚动事件监听器
const addScrollListener = () => {
  const scrollEl = getScrollEl()
  if (scrollEl) {
    // 初始化滚动位置
    lastScrollLeft = scrollEl.scrollLeft
    lastScrollTop = scrollEl.scrollTop

    // 使用 passive: true 监听 scroll
    scrollEl.addEventListener('scroll', handleScroll, { passive: true })
  }
}

// 移除滚动事件监听器
const removeScrollListener = () => {
  const scrollEl = getScrollEl()
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', handleScroll)
  }
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
}

// 生命周期钩子
onMounted(() => {
  // 延迟添加事件监听器，确保DOM已渲染
  setTimeout(() => {
    addScrollListener()
  }, 100)
})

onUnmounted(() => {
  removeScrollListener()
})

// 暴露给父组件的方法和属性
defineExpose({
  scrollbarRef,
  getScrollEl,
  scrollTo,
  scrollToTop,
  scrollToBottom,
  scrollToLeft,
  scrollToRight,
  addScrollListener,
  removeScrollListener,
})
</script>

<template>
  <div
    class="custom-scrollbar-wrapper container rounded-rounded"
    :style="{
      '--thumb-color': mergedColorScheme.thumbColor,
      '--thumb-hover-color': mergedColorScheme.thumbHoverColor,
      '--track-color': mergedColorScheme.trackColor,
      '--thumb-placeholder-color': mergedColorScheme.thumbPlaceholderColor,
    }"
  >
    <!-- 准备就绪后：使用自定义滚动条 -->
    <CustomScrollbar
      ref="scrollbarRef"
      :class="props.class"
      :style="props.style"
      :wrapper-class="props.wrapperClass"
      :wrapper-style="props.wrapperStyle"
      :content-class="props.contentClass"
      :content-style="props.contentStyle"
      :direction="props.direction"
      :thumb-width="computedThumbWidth"
      :auto-hide="props.autoHide"
      :auto-hide-delay="props.autoHideDelay"
      :auto-expand="props.autoExpand"
      :fixed-thumb="props.fixedThumb"
      :throttle-type="props.throttleType"
      :throttle-wait="props.throttleWait"
      :simulate-scroll="props.simulateScroll"
      @wrapper-resize="handleWrapperResize"
      @content-resize="handleContentResize"
      v-bind="$attrs"
    >
      <slot />
    </CustomScrollbar>
  </div>
</template>

<style scoped>
.custom-scrollbar-wrapper {
  background: transparent;
}
/* 隐藏原生滚动条 */
.custom-scrollbar-wrapper div::-webkit-scrollbar {
  display: none;
}

/* 自定义滚动条样式 */
.custom-scrollbar-wrapper :deep(.scrollbar__thumb) {
  background-color: var(--thumb-color) !important;
  border-radius: 24px;
}

.custom-scrollbar-wrapper :deep(.scrollbar__thumb:hover) {
  background-color: var(--thumb-hover-color) !important;
}

.custom-scrollbar-wrapper :deep(.scrollbar__thumbPlaceholder--vertical) {
  background-color: var(--thumb-placeholder-color);
}

.custom-scrollbar-wrapper :deep(.scrollbar__thumbPlaceholder--horizontal) {
  background-color: var(--thumb-placeholder-color);
}

.custom-scrollbar-wrapper :deep(.scrollbar__track) {
  background-color: var(--track-color);
}
</style>
