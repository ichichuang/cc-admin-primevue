<script setup lang="ts">
import { getCurrentRoute, goToRoute } from '@/common'
import ScrollbarWrapper from '@/components/modules/scrollbar-wrapper/ScrollbarWrapper.vue'
import type { ScrollEvent } from '@/components/modules/scrollbar-wrapper/utils/types'
import { useLocale } from '@/hooks'
import { useLayoutStore, usePermissionStore, type TabItem } from '@/stores'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { $t } = useLocale()

const layoutStore = useLayoutStore()
const permissionStore = usePermissionStore()
const router = useRouter()

// 侧边栏收缩状态
const isSidebarCollapsed = computed(() => layoutStore.getSidebarCollapsed)

// 使用 store 的 tabs 计算属性
const tabs = computed(() => permissionStore.getTabs)

// 动态计算标签文本的计算属性
const dynamicTabs = computed(() => {
  return tabs.value.map(tab => ({
    ...tab,
    label: tab.titleKey ? $t(tab.titleKey) : tab.title || tab.name || '',
  }))
})

// 当前激活的标签页
const activeTab = computed(() => dynamicTabs.value.find(tab => tab.active))

// DOM refs
const containerRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()
const scrollbarRef = ref<InstanceType<typeof ScrollbarWrapper>>()

// 右键菜单相关
const contextMenuRef = ref()
const contextMenuTarget = ref<TabItem | null>(null)

// 拖拽相关状态
const dragCleanupMap = new Map<string, () => void>()
const dropCleanupMap = new Map<string, () => void>()
const isDragging = ref(false)
const dragOverIndex = ref(-1)

// 用于测量单个 tab 的元素集合
const itemRefs = new Map<string, HTMLElement>()

// 设置拖拽功能
const setupDragAndDrop = (key: string, el: HTMLElement, tab: TabItem, index: number) => {
  // 清理旧的拖拽监听器
  const oldDragCleanup = dragCleanupMap.get(key)
  if (oldDragCleanup) {
    oldDragCleanup()
    dragCleanupMap.delete(key)
  }

  const oldDropCleanup = dropCleanupMap.get(key)
  if (oldDropCleanup) {
    oldDropCleanup()
    dropCleanupMap.delete(key)
  }

  // 固定标签不可拖拽
  if (tab.fixed) {
    return
  }

  // 设置可拖拽
  const dragCleanup = draggable({
    element: el,
    getInitialData: () => ({
      type: 'tab',
      tabKey: key,
      index,
      tab,
    }),
    onDragStart: () => {
      isDragging.value = true
    },
  })

  // 设置放置目标
  const dropCleanup = dropTargetForElements({
    element: el,
    getData: ({ input: _input, element: _element }) => ({
      type: 'tab-drop-target',
      index,
    }),
    onDragEnter: () => {
      dragOverIndex.value = index
    },
    onDragLeave: () => {
      dragOverIndex.value = -1
    },
    onDrop: ({ source, location: _location }) => {
      isDragging.value = false
      dragOverIndex.value = -1

      if (source.data.type === 'tab') {
        const sourceIndex = source.data.index as number
        const targetIndex = index

        if (sourceIndex !== targetIndex) {
          // 调用 store 方法重新排序标签
          permissionStore.reorderTabs(sourceIndex, targetIndex)
        }
      }
    },
  })

  dragCleanupMap.set(key, dragCleanup)
  dropCleanupMap.set(key, dropCleanup)
}

const setItemRef = (
  key: string | undefined,
  el: HTMLElement | null,
  tab: TabItem,
  index: number
) => {
  if (!key) {
    return
  }

  if (el) {
    itemRefs.set(key, el)
    // 设置拖拽功能
    nextTick(() => {
      setupDragAndDrop(key, el, tab, index)
    })
  } else {
    itemRefs.delete(key)
    // 清理拖拽监听器
    const dragCleanup = dragCleanupMap.get(key)
    if (dragCleanup) {
      dragCleanup()
      dragCleanupMap.delete(key)
    }
    const dropCleanup = dropCleanupMap.get(key)
    if (dropCleanup) {
      dropCleanup()
      dropCleanupMap.delete(key)
    }
  }
}

const getKey = (tab: TabItem) => String(tab?.name ?? tab?.path ?? '')

// 供模板使用的 ref 回调工厂
const createItemRef = (tab: TabItem, index: number) => (el: any) => {
  setItemRef(getKey(tab), el as HTMLElement | null, tab, index)
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
const observedHeight = ref(0)
const showIndicator = ref(false)

// 水平滚动距离
const scrollLeft = ref(0)

// 右键菜单处理函数
const handleContextMenu = (event: MouseEvent, tab: TabItem) => {
  event.preventDefault()
  contextMenuTarget.value = tab
  contextMenuRef.value?.show(event)
}

// 右键菜单项配置
const contextMenuItems = computed(() => {
  const target = contextMenuTarget.value
  if (!target) {
    return []
  }

  const currentIndex = dynamicTabs.value.findIndex(tab => tab.name === target.name)
  const hasOtherTabs = dynamicTabs.value.length > 1
  const canCloseLeft = currentIndex > 0
  const canCloseRight = currentIndex < dynamicTabs.value.length - 1

  return [
    {
      label: $t('layout.tabs.close'),
      icon: 'pi pi-times',
      command: () => closeTab(target),
      disabled: target.fixed, // 固定的标签不可删除
    },
    {
      label: $t('layout.tabs.closeAll'),
      icon: 'pi pi-times-circle',
      command: () => closeAllTabs(),
      disabled: !hasOtherTabs,
    },
    {
      label: $t('layout.tabs.closeOther'),
      icon: 'pi pi-minus-circle',
      command: () => closeOtherTabs(target),
      disabled: !hasOtherTabs,
    },
    {
      label: $t('layout.tabs.closeLeft'),
      icon: 'pi pi-chevron-left',
      command: () => closeLeftTabs(target),
      disabled: !canCloseLeft,
    },
    {
      label: $t('layout.tabs.closeRight'),
      icon: 'pi pi-chevron-right',
      command: () => closeRightTabs(target),
      disabled: !canCloseRight,
    },
    {
      separator: true,
    },
    {
      label: target.fixed ? $t('layout.tabs.unFixed') : $t('layout.tabs.fixed'),
      icon: target.fixed ? 'pi pi-unlock' : 'pi pi-lock',
      command: () => toggleFixedTab(target),
    },
  ]
})

// 标签页操作方法

// 关闭指定标签
const closeTab = (tab: TabItem) => {
  if (tab.fixed) {
    return // 固定的标签不可删除
  }

  const isClosingActiveTab = tab.active

  // 如果关闭的是当前激活的标签，需要跳转到其他标签
  if (isClosingActiveTab) {
    const currentIndex = dynamicTabs.value.findIndex(t => t.name === tab.name)
    const nextTab = dynamicTabs.value[currentIndex + 1] || dynamicTabs.value[currentIndex - 1]

    if (nextTab) {
      goToRoute(String(nextTab.name))
    } else {
      // 如果没有其他标签，跳转到首页
      router.push('/')
    }
  }

  // 使用 store 方法移除标签
  permissionStore.removeTab(tab.name || tab.path)
}

// 关闭所有标签
const closeAllTabs = () => {
  const currentRoute = getCurrentRoute()

  // 移除所有非固定标签页
  const nonFixedTabs = dynamicTabs.value.filter(tab => !tab.fixed)
  nonFixedTabs.forEach(tab => {
    permissionStore.removeTab(tab.name || tab.path)
  })

  // 如果当前路由不在固定标签中，跳转到第一个固定标签或首页
  const fixedTabs = dynamicTabs.value.filter(tab => tab.fixed)
  const isCurrentRouteFixed = fixedTabs.some(tab => tab.name === currentRoute.name)
  if (!isCurrentRouteFixed) {
    const firstFixedTab = fixedTabs[0]
    if (firstFixedTab) {
      goToRoute(String(firstFixedTab.name))
    } else {
      router.push('/')
    }
  }
}

// 关闭其他标签
const closeOtherTabs = (targetTab: TabItem) => {
  const tabsToKeep = dynamicTabs.value.filter(tab => tab.name === targetTab.name || tab.fixed)
  const namesToKeep = tabsToKeep.map(tab => tab.name || tab.path)

  // 保留指定的标签页，移除其他标签页
  permissionStore.removeTabsExcept(namesToKeep)

  // 如果目标标签不是当前激活的，跳转到目标标签
  if (!targetTab.active) {
    goToRoute(String(targetTab.name))
  }
}

// 关闭左侧标签
const closeLeftTabs = (targetTab: TabItem) => {
  const currentIndex = dynamicTabs.value.findIndex(tab => tab.name === targetTab.name)

  // 移除当前索引之前的标签页（保留固定标签页）
  const tabsToRemove = dynamicTabs.value.filter((tab, index) => index < currentIndex && !tab.fixed)

  // 逐个移除要删除的标签页
  tabsToRemove.forEach(tab => {
    permissionStore.removeTab(tab.name || tab.path)
  })

  if (!targetTab.active) {
    goToRoute(String(targetTab.name))
  }
}

// 关闭右侧标签
const closeRightTabs = (targetTab: TabItem) => {
  const currentIndex = dynamicTabs.value.findIndex(tab => tab.name === targetTab.name)

  // 移除当前索引之后的标签页（保留固定标签页）
  const tabsToRemove = dynamicTabs.value.filter((tab, index) => index > currentIndex && !tab.fixed)

  // 逐个移除要删除的标签页
  tabsToRemove.forEach(tab => {
    permissionStore.removeTab(tab.name || tab.path)
  })

  if (!targetTab.active) {
    goToRoute(String(targetTab.name))
  }
}

// 切换标签固定状态
const toggleFixedTab = (tab: TabItem) => {
  // 使用 store 方法更新标签的 meta 属性
  permissionStore.updateTabMeta(tab.name || tab.path, {
    fixed: !tab.fixed,
  })
}

// 指示器更新逻辑
const updateIndicator = async (maxRetries = 10) => {
  const active = activeTab.value
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

  if (!elRect.width || !elRect.height) {
    return
  }

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

  showIndicator.value = true
}

// 自动滚动到选中tab项的中心
const scrollToActiveTabCenter = async (maxRetries = 10) => {
  const active = activeTab.value
  const scrollbar = scrollbarRef.value
  const track = trackRef.value

  if (!active || !scrollbar || !track) {
    return
  }

  const el = itemRefs.get(getKey(active))
  if (!el) {
    if (maxRetries > 0) {
      setTimeout(() => scrollToActiveTabCenter(maxRetries - 1), 50)
    }
    return
  }

  await new Promise(resolve => requestAnimationFrame(resolve))

  const scrollEl = scrollbar.getScrollEl()
  if (!scrollEl) {
    return
  }

  const itemOffsetLeft = el.offsetLeft
  const itemWidth = el.offsetWidth
  const containerWidth = scrollEl.clientWidth
  const scrollWidth = scrollEl.scrollWidth

  if (itemWidth === 0 && maxRetries > 0) {
    setTimeout(() => scrollToActiveTabCenter(maxRetries - 1), 50)
    return
  }

  if (itemWidth === 0) {
    return
  }

  // 计算目标滚动位置：使选中项居中
  const itemCenter = itemOffsetLeft + itemWidth / 2
  const targetScrollLeft = itemCenter - containerWidth / 2
  const maxScrollLeft = scrollWidth - containerWidth
  const clampedScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft))

  scrollbar.scrollTo({
    left: clampedScrollLeft,
    behavior: 'smooth',
  })
}

// 处理水平滚动事件
const handleScrollHorizontal = (event: ScrollEvent) => {
  scrollLeft.value = event.scrollLeft
}

// Observer 相关
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
    resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) {
        return
      }
      const height = Math.round(entry.contentRect.height)
      if (height !== observedHeight.value) {
        observedHeight.value = height
        containerHeight.value = height
        nextTick(() => {
          updateIndicator()
          // 尽量保持活动项居中
          scrollToActiveTabCenter()
        })
      }
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

// 生命周期
onMounted(() => {
  nextTick(async () => {
    await new Promise(resolve => requestAnimationFrame(resolve))
    setupObservers()
    updateIndicator()
    scrollToActiveTabCenter()

    // 监听侧边栏收缩状态变化
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

  // 清理所有拖拽监听器
  dragCleanupMap.forEach(cleanup => cleanup())
  dropCleanupMap.forEach(cleanup => cleanup())
  dragCleanupMap.clear()
  dropCleanupMap.clear()
})

// 路由初始化和监听
const currentRoute = getCurrentRoute()
permissionStore.addTab(currentRoute.name || currentRoute.path)
permissionStore.updateTabActive(currentRoute.name || currentRoute.path)

router.afterEach(to => {
  permissionStore.addTab(to.name || to.path)
  permissionStore.updateTabActive(to.name || to.path)
  nextTick(() => {
    setTimeout(() => {
      scrollToActiveTabCenter()
    }, 100)
  })
})

// 监听标签页变化，更新指示器
watch(
  () => dynamicTabs.value,
  () => {
    nextTick(() => {
      updateIndicator()
    })
  },
  { deep: true }
)

// 监听激活标签变化，滚动到中心
watch(
  () => activeTab.value,
  () => {
    nextTick(() => {
      scrollToActiveTabCenter()
    })
  }
)
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

  ScrollbarWrapper.c-transitions(
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

        //- 标签列表 - 直接使用 store 中的 tabs
        template(v-for='(tab, index) in dynamicTabs', :key='tab.name || tab.path')
          .center.relative.z-2.h-full.mx-gaps.px-padding.bg-tm.border-none.color-text200.select-none(
            :ref='createItemRef(tab, index)',
            :class='[tab.active ? "active color-accent200" : "color-text200 hover:color-text100 tab-item", { "cursor-move": !tab.fixed, "c-cp": tab.fixed, dragging: isDragging && dragOverIndex === index, "drag-over": dragOverIndex === index && !isDragging }]',
            @click='goToRoute(String(tab?.name))',
            @contextmenu='handleContextMenu($event, tab)',
            :aria-haspopup='true'
          )
            .between.gap-gaps
              .bg-text200.fs-appFontSizes(class='icon-line-md:hash-small', v-if='tab.fixed')
              p.truncate.c-transition.c-cp {{ tab.label }}
              .bg-text200.fs-appFontSizes.c-transition.c-cp(
                class='icon-line-md:remove hover:bg-dangerColor',
                v-if='tab.deletable && !tab.fixed',
                @click.stop='closeTab(tab)'
              )
          //- 分隔线
          .w-1.h-full.py-paddings(v-if='index !== dynamicTabs.length - 1')
            .full.bg-bg300
  //- 右键菜单
  ContextMenu(ref='contextMenuRef', :model='contextMenuItems', @hide='contextMenuTarget = null')
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

/* 拖拽相关样式 */
.cursor-move {
  cursor: move;
}

.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  transition: all 0.2s ease;
}

.drag-over {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--accent100) 20%, transparent);
  transition: all 0.2s ease;
}

/* 拖拽时的指示器 */
.drag-over::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent100);
  border-radius: 1px;
}
</style>
