<script setup lang="ts">
import { useElementSize } from '@/hooks'
import { useLayoutStore } from '@/stores'
import { computed, nextTick, ref } from 'vue'

const layoutStore = useLayoutStore()
const currentLayoutMode = computed(() => layoutStore.getCurrentLayout)
const containerRef = ref<HTMLElement | null>(null)
const containerHeight = ref(0)

const getContainerHeight = async () => {
  await nextTick()
  if (containerRef.value) {
    console.log('初始化 AppContainer 内容容器高度: ', containerRef.value.clientHeight)
    containerHeight.value = containerRef.value.clientHeight
  }
}

// 节流模式，每 300ms 更新一次
useElementSize(
  containerRef,
  () => {
    getContainerHeight()
  },
  { mode: 'debounce', delay: 100 }
)
</script>

<template lang="pug">
.full(ref='containerRef')
  ScrollbarWrapper(
    :class='currentLayoutMode !== "fullscreen" && currentLayoutMode !== "ratio" ? "px-padding lg:px-paddingx xxl:px-paddingl c-transitions" : ""',
    :style='{ height: containerHeight + "px" }'
  )
    AminateRouterView.container(:style='{ minHeight: containerHeight + "px" }')
</template>
