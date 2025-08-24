<script setup lang="ts">
import { useLayoutStore, useSizeStore } from '@/stores'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const sizeStore = useSizeStore()
const layoutStore = useLayoutStore()
const currentLayoutMode = computed(() => layoutStore.getCurrentLayout)
const containerRef = ref<HTMLElement>()
const containerHeight = computed(() => containerRef.value?.clientHeight || 0)
const isReady = ref(false)

// 监听容器高度变化，重新计算尺寸
watch(containerHeight, newHeight => {
  if (newHeight > 0 && isReady.value) {
    // 延迟重新计算，确保 DOM 更新完成
    nextTick(() => {
      sizeStore.recalculateSizes()
    })
  }
})

onMounted(async () => {
  await nextTick()
  isReady.value = true

  // 确保在组件挂载后重新计算一次尺寸
  setTimeout(() => {
    sizeStore.recalculateSizes()
  }, 50)
})
</script>
<template lang="pug">
.full.c-transition(ref='containerRef')
  template(v-if='isReady')
    ScrollbarWrapper(
      :class='currentLayoutMode !== "fullscreen" ? "px-padding lg:px-paddingx xxl:px-paddingl" : ""',
      :style='{ height: containerHeight + "px" }'
    )
      AminateRouterView.container(:style='{ minHeight: containerHeight + "px" }')
</template>
