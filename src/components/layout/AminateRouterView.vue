<script setup lang="ts">
import { routeWhitePathList } from '@/common'
import { routeUtils } from '@/router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
// 检查当前路由是否在白名单中
const isWhiteListRoute = computed(() => routeWhitePathList.includes(route.path as any))

// 只有在非白名单路由时才计算 keepAliveNames
const keepAliveNames = computed(() => {
  if (isWhiteListRoute.value) {
    return []
  }
  return routeUtils.flatRoutes.filter(r => r.meta?.keepAlive && r.name).map(r => r.name as string)
})
</script>
<template lang="pug">
router-view(v-slot='{ Component }')
  keep-alive(:include='keepAliveNames')
    transition(
      appear,
      mode='out-in',
      name='animate__animated animate__faster',
      enter-active-class='animate__slideInRight animate__faster',
      leave-active-class='animate__slideOutLeft animate__faster'
    )
      component(:is='Component')
</template>
<style lang="scss" scope>
.animate__faster {
  animation-duration: 300ms !important;
}
</style>
