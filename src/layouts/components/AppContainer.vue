<script setup lang="ts">
import { ScrollbarWrapper } from '@/components/modules/scrollbar-wrapper'
import { useElementSize } from '@/hooks'
import { useLayoutStore } from '@/stores'
import { computed, ref } from 'vue'

const layoutStore = useLayoutStore()
const currentLayoutMode = computed(() => layoutStore.getCurrentLayout)
const containerRef = ref<HTMLElement | null>(null)
const scrollbarRef = ref()

// 直接使用 useElementSize 返回的响应式高度，避免手动 nextTick 和 DOM 读取
const { height: containerHeight } = useElementSize(containerRef, undefined, {
  mode: 'debounce',
  delay: 100,
})
</script>

<template lang="pug">
.full.relative(ref='containerRef')
  ScrollbarWrapper(
    ref='scrollbarRef',
    :wrapper-class='currentLayoutMode !== "fullscreen" && currentLayoutMode !== "ratio" ? "px-12 sm:px-16  lg:px-18 xxl:px-24" : ""',
    :style='{ height: containerHeight + "px" }',
    :size='0'
  )
    AnimateRouterView(:style='{ minHeight: containerHeight + "px" }')
</template>
