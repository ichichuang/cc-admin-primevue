<script setup lang="ts">
import { getCurrentRoute, goToRoute } from '@/common'
import ScrollbarWrapper from '@/components/modules/scrollbar-wrapper/ScrollbarWrapper.vue'
import type { ScrollEvent } from '@/components/modules/scrollbar-wrapper/utils/types'
import { useLocale } from '@/hooks'
import { useLayoutStore, usePermissionStore } from '@/stores'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { $t } = useLocale()

const layoutStore = useLayoutStore()
const permissionStore = usePermissionStore()
const router = useRouter()
// 侧边栏收缩状态
const isSidebarCollapsed = computed(() => layoutStore.getSidebarCollapsed)
const tabs = computed(() => permissionStore.getTabs)

// DOM refs
const containerRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()
const scrollbarRef = ref<InstanceType<typeof ScrollbarWrapper>>()

// 用于测量单个 tab 的元素集合
const itemRefs = new Map<string, HTMLElement>()
const setItemRef = (key: string | undefined, el: HTMLElement | null) => {
  if (!key) {
    return
  }
  if (el) {
    itemRefs.set(key, el)
  } else {
    itemRefs.delete(key)
  }
}

const getKey = (obj: any) => String(obj?.name ?? obj?.path ?? '')

// 供模板使用的 ref 回调工厂，避免在模板里写 TS 断言
const createItemRef = (tab: any) => (el: any) => {
  setItemRef(getKey(tab), el as any as HTMLElement | null)
  // 当元素被设置时，延迟更新指示器
  if (el) {
    nextTick(() => {
      setTimeout(() => updateIndicator(), 10)
    })
  }
}

// 指示器位置信息
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)
const indicatorHeight = ref(0)
const containerHeight = ref(0)

// 是否显示指示器
const showIndicator = ref(false)

/* 设置 tab 渲染数据 */
const tabList = computed(() => {
  const currentRoute = getCurrentRoute()
  return tabs.value.map(tab => ({
    name: tab.name,
    path: tab.path,
    label: tab.meta?.titleKey ? $t(tab.meta?.titleKey) : tab.meta?.title || tab.name,
    active: tab.name === currentRoute.name || tab.path === currentRoute.path,
    route: tab,
  }))
})

const activeItem = computed(() => tabList.value.find(t => t.active))

// 优化的 updateIndicator 函数
const updateIndicator = async (maxRetries = 10) => {
  const active = activeItem.value
  const track = trackRef.value

  if (!active || !track) {
    showIndicator.value = false
    return
  }

  const el = itemRefs.get(getKey(active))
  if (!el) {
    showIndicator.value = false
    return
  }

  // 等待样式计算完成
  await new Promise(resolve => requestAnimationFrame(resolve))

  const trackRect = track.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  // 如果尺寸不合理且还有重试次数
  if ((elRect.width === 0 || elRect.height === 0) && maxRetries > 0) {
    setTimeout(() => updateIndicator(maxRetries - 1), 20)
    return
  }

  // 如果仍然获取不到合理尺寸，隐藏指示器
  if (elRect.width === 0 || elRect.height === 0) {
    showIndicator.value = false
    return
  }

  indicatorLeft.value = elRect.left - trackRect.left
  indicatorWidth.value = elRect.width
  indicatorHeight.value = elRect.height
  containerHeight.value = containerRef.value?.clientHeight ?? elRect.height

  // 只有获取到合理尺寸才显示指示器
  showIndicator.value = true
}

// 使用 MutationObserver 监听DOM变化
let mutationObserver: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null

const setupObservers = () => {
  if (!containerRef.value) {
    return
  }

  // 监听DOM结构变化
  if ('MutationObserver' in window) {
    mutationObserver = new MutationObserver(() => {
      updateIndicator()
    })
    mutationObserver.observe(containerRef.value, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })
  }

  // 监听尺寸变化
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      updateIndicator()
    })
    resizeObserver.observe(containerRef.value)
  }
}

const cleanupObservers = () => {
  if (mutationObserver) {
    mutationObserver.disconnect()
    mutationObserver = null
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

onMounted(() => {
  nextTick(async () => {
    // 等待多个渲染帧确保DOM完全准备好
    await new Promise(resolve => requestAnimationFrame(resolve))
    setupObservers()
    updateIndicator()
    // 初始化后滚动到选中tab项中心
    scrollToActiveTabCenter()
    watch(
      () => isSidebarCollapsed.value,
      () => {
        scrollToActiveTabCenter()
      }
    )
  })
})

onBeforeUnmount(() => {
  cleanupObservers()
})

// 初始化与路由变化
const currentRoute = getCurrentRoute()
permissionStore.addTab(currentRoute.name || currentRoute.path)
router.afterEach((to, from) => {
  console.log(to, from)
  console.log(to.name)
  permissionStore.addTab(to.name || to.path)
  // 路由变化后滚动到选中tab项中心
  nextTick(() => {
    setTimeout(() => {
      scrollToActiveTabCenter()
    }, 100) // 延迟确保DOM更新完成
  })
})

// 水平滚动距离
const scrollLeft = ref(0)
// 处理水平滚动事件
const handleScrollHorizontal = (event: ScrollEvent) => {
  console.log('水平滚动:', {
    scrollLeft: event.scrollLeft,
    deltaX: event.deltaX,
    progress: (event.scrollLeft / (event.scrollWidth - event.clientWidth)) * 100,
  })
  scrollLeft.value = event.scrollLeft
}

// 自动滚动到选中tab项的中心 - 针对您的ScrollbarWrapper组件的正确实现
const scrollToActiveTabCenter = async (maxRetries = 10) => {
  const active = activeItem.value
  const scrollbar = scrollbarRef.value
  const track = trackRef.value

  if (!active || !scrollbar || !track) {
    return
  }

  const el = itemRefs.get(getKey(active))
  if (!el) {
    // 如果元素还没准备好，重试
    if (maxRetries > 0) {
      setTimeout(() => scrollToActiveTabCenter(maxRetries - 1), 50)
    }
    return
  }

  // 等待样式计算完成
  await new Promise(resolve => requestAnimationFrame(resolve))

  // 获取当前滚动容器的信息
  const scrollEl = scrollbar.getScrollEl()
  if (!scrollEl) {
    return
  }

  // 使用 offsetLeft 获取元素在滚动内容中的绝对位置
  const itemOffsetLeft = el.offsetLeft
  const itemWidth = el.offsetWidth

  const containerWidth = scrollEl.clientWidth
  const scrollWidth = scrollEl.scrollWidth

  // 如果尺寸不合理且还有重试次数
  if (itemWidth === 0 && maxRetries > 0) {
    setTimeout(() => scrollToActiveTabCenter(maxRetries - 1), 50)
    return
  }

  // 如果仍然获取不到合理尺寸，放弃滚动
  if (itemWidth === 0) {
    return
  }

  // 计算目标滚动位置：使选中项居中
  // 选中项的中心位置 - 容器的一半宽度 = 目标滚动位置
  const itemCenter = itemOffsetLeft + itemWidth / 2
  const targetScrollLeft = itemCenter - containerWidth / 2

  // 确保滚动位置在有效范围内
  const maxScrollLeft = scrollWidth - containerWidth
  const clampedScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft))

  // 调试信息
  console.log('滚动计算（针对ScrollbarWrapper）:', {
    itemOffsetLeft,
    itemWidth,
    itemCenter,
    containerWidth,
    scrollWidth,
    targetScrollLeft,
    maxScrollLeft,
    clampedScrollLeft,
    currentScrollLeft: scrollEl.scrollLeft,
  })

  // 使用 ScrollbarWrapper 的 scrollTo 方法（这是正确的方法）
  scrollbar.scrollTo({
    left: clampedScrollLeft,
    behavior: 'smooth',
  })
}
</script>
<template lang="pug">
.full(ref='containerRef')
  //- SVG goo filter（仅一次定义在本组件范围内）
  svg(width='0', height='0', style='position: absolute')
    defs
      filter#app-tabs-goo
        feGaussianBlur(in='SourceGraphic', stdDeviation='6', result='blur')
        feColorMatrix(
          in='blur',
          mode='matrix',
          values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7',
          result='goo'
        )
        feBlend(in='SourceGraphic', in2='goo')
  ScrollbarWrapper(
    ref='scrollbarRef',
    :style='{ height: containerHeight + "px" }',
    :thumb-width='2',
    :direction='"horizontal"',
    @scroll-horizontal='handleScrollHorizontal'
  )
    .py-4.center(class='sm:py-6 md:py-paddings')
      .full.between-start(ref='trackRef')
        //- 活动背景 - 只有在确认有合理尺寸时才渲染
        Transition(name='indicator', mode='out-in')
          .active-blob(
            v-if='showIndicator && indicatorWidth > 0 && indicatorHeight > 0',
            :style='{ "--left": indicatorLeft - scrollLeft + "px", "--width": indicatorWidth + "px", "--height": indicatorHeight + "px" }'
          )
        //- 标签列表
        template(v-for='(tab, index) in tabList', :key='tab.name || tab.path')
          .center.relative.z-2.h-full.mx-gaps.px-padding.bg-tm.border-none.color-text200.cursor-pointer(
            :ref='createItemRef(tab)',
            :class='tab.active ? "active color-accent200" : "color-text200 hover:color-text100  tab-item"',
            @click='goToRoute(String(tab?.name))'
          )
            p.truncate {{ tab.label }}
          .w-1.h-full.py-paddings(v-if='index !== tabList.length - 1')
            .full.bg-text200
</template>
<style lang="scss" scoped>
/* 使用主题色变量的玻璃背景效果 Active Blob 样式 */
.active-blob {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateX(var(--left)) translateY(-50%);
  width: var(--width);
  height: var(--height);

  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--accent100) 20%, transparent),
      color-mix(in srgb, var(--accent100) 5%, transparent)
    ),
    color-mix(in srgb, var(--bg100) 80%, transparent);

  /* 玻璃背景效果 - 使用主背景色的半透明版本 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* 多层渐变背景 - 基于主题色创建玻璃效果 */

  /* 玻璃边框 - 使用主色调的半透明 */
  border: 1px solid color-mix(in srgb, var(--accent100) 20%, transparent);
  border-top: 1px solid transparent;
  border-bottom: 1px solid color-mix(in srgb, var(--accent200) 30%, transparent);
  border-left: 1px solid color-mix(in srgb, var(--accent100) 30%, transparent);

  /* 圆角 */
  border-radius: var(--rounded);
  /* 阴影增强立体感 - 使用强调色和主色 */
  box-shadow:
    0 8px 32px color-mix(in srgb, var(--accent100) 8%, transparent),
    0 4px 16px color-mix(in srgb, var(--accent100) 6%, transparent),
    0 1px 0 color-mix(in srgb, var(--accent100) 40%, transparent);

  /* 保留原有的滤镜和过渡效果 */
  filter: url(#app-tabs-goo);
  transition:
    transform 0.14s cubic-bezier(0.2, 0.8, 0.2, 1),
    width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    height 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    background 0.3s ease,
    border 0.3s ease,
    box-shadow 0.3s ease;

  z-index: 1;
}

/* 悬停时增强玻璃效果 */
.tab-item {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--bg200) 20%, transparent),
      color-mix(in srgb, var(--bg300) 5%, transparent)
    ),
    color-mix(in srgb, var(--bg100) 80%, transparent);

  border-radius: var(--rounded);

  box-shadow:
    0 8px 32px color-mix(in srgb, var(--primary200) 8%, transparent),
    0 4px 16px color-mix(in srgb, var(--primary200) 6%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--primary200) 40%, transparent);
}
.dark .tab-item {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--primary200) 20%, transparent),
      color-mix(in srgb, var(--primary300) 5%, transparent)
    ),
    color-mix(in srgb, var(--bg300) 80%, transparent);
}

// 指示器淡入淡出动画
.indicator-enter-active,
.indicator-leave-active {
  transition: opacity 0.2s ease;
}

.indicator-enter-from,
.indicator-leave-to {
  opacity: 0;
}
</style>
