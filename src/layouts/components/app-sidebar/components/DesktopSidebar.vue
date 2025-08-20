<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import type { MenuItem } from 'primevue/menuitem'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  items: MenuItem[]
  componentsProps: Record<string, any>
}>()

const layoutStore = useLayoutStore()
// 折叠状态
const isCollapsed = computed(() => layoutStore.sidebarCollapsed)

// 展开延迟
const expandedDelay = ref<boolean>(false)
// 折叠延迟
const collapsedDelay = ref<boolean>(false)

watch(
  isCollapsed,
  flag => {
    if (flag) {
      expandedDelay.value = flag
      setTimeout(() => {
        collapsedDelay.value = flag
      }, 120)
    } else {
      collapsedDelay.value = flag
      setTimeout(() => {
        expandedDelay.value = flag
      }, 120)
    }
  },
  { immediate: true, deep: true }
)

const containerRef = ref<HTMLElement>()
const containerHeight = computed(() => containerRef.value?.clientHeight || 0)
const isReady = ref(false)
onMounted(async () => {
  await nextTick()
  isReady.value = true
})
</script>
<template lang="pug">
.full(ref='containerRef')
  AnimateWrapper(
    :show='collapsedDelay',
    enter='slideInLeft',
    leave='fadeOutLeft',
    duration='120ms'
  )
    .w-full(:style='{ height: containerHeight + "px" }')
      //- 折叠状态
      PrimeVueMenu(:type='"tier"', :items='props.items', :components-props='props.componentsProps')

  AnimateWrapper(
    :show='!expandedDelay',
    enter='slideInLeft',
    leave='slideOutLeft',
    duration='120ms'
  )
    ScrollbarWrapper(:style='{ height: containerHeight + "px" }')
      //- 展开状态
      PrimeVueMenu(
        :type='"panel"',
        :items='props.items',
        :components-props='props.componentsProps'
      )
</template>
