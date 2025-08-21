<script setup lang="ts">
import { routeWhitePathList } from '@/common'
import { routeUtils } from '@/router'
import { useSizeStore } from '@/stores'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sizeStore = useSizeStore()

// 检查当前路由是否在白名单中
const isWhiteListRoute = computed(() => routeWhitePathList.includes(route.path as any))

// 只有在非白名单路由时才计算 keepAliveNames
const keepAliveNames = computed(() => {
  if (isWhiteListRoute.value) {
    return []
  }
  return routeUtils.flatRoutes.filter(r => r.meta?.keepAlive && r.name).map(r => r.name as string)
})

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
.full(ref='containerRef')
  template(v-if='isReady')
    ScrollbarWrapper(:style='{ height: containerHeight + "px" }')
      router-view(v-slot='{ Component }')
        keep-alive(:include='keepAliveNames')
          component(:is='Component')
</template>
<style lang="scss" scope></style>
