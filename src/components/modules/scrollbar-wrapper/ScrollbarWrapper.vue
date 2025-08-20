<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import CustomScrollbar from 'custom-vue-scrollbar'
import type { ComponentPublicInstance } from 'vue'
import { computed, ref } from 'vue'
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

// 定义事件
interface Emits {
  (e: 'wrapper-resize', rect: Rect): void
  (e: 'content-resize', rect: Rect): void
}

const emit = defineEmits<Emits>()

// 合并颜色方案
const mergedColorScheme = computed(() => ({
  ...defaultColorScheme,
  ...props.colorScheme,
}))

// 事件处理器
const handleWrapperResize = (rect: Rect) => {
  emit('wrapper-resize', rect)
}

const handleContentResize = (rect: Rect) => {
  emit('content-resize', rect)
}

// 暴露滚动元素的引用，方便外部调用原生滚动API
const getScrollEl = () => {
  return scrollbarRef.value?.$el?.querySelector('[data-scrollbar-wrapper]') || null
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

// 暴露给父组件的方法和属性
defineExpose({
  scrollbarRef,
  getScrollEl,
  scrollTo,
  scrollToTop,
  scrollToBottom,
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
