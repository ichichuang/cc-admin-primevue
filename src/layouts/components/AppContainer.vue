<script setup lang="ts">
import { useElementSize } from '@/hooks'
import { useLayoutStore } from '@/stores'
import { computed, ref } from 'vue'

const layoutStore = useLayoutStore()
const currentLayoutMode = computed(() => layoutStore.getCurrentLayout)
const containerRef = ref<HTMLElement | null>(null)

// 直接使用 useElementSize 返回的响应式高度，避免手动 nextTick 和 DOM 读取
const { height: containerHeight } = useElementSize(containerRef, undefined, {
  mode: 'debounce',
  delay: 100,
})
</script>

<template lang="pug">
.full(ref='containerRef')
  ScrollbarWrapper(
    :class='currentLayoutMode !== "fullscreen" && currentLayoutMode !== "ratio" ? "px-padding lg:px-paddingx xxl:px-paddingl c-transitions" : ""',
    :style='{ height: containerHeight + "px" }'
  )
    AminateRouterView.container(:style='{ minHeight: containerHeight + "px" }')
</template>
