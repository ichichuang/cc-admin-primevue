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

// 动态过渡：若提供 enter/leave 类名则优先使用；否则回退到 name；再回退到默认值
const rawTransition = computed(() => route.meta?.transition || {})
const hasCustomClass = computed(() =>
  Boolean(
    (rawTransition.value as any).enterTransition || (rawTransition.value as any).leaveTransition
  )
)
const transitionName = computed(() =>
  !hasCustomClass.value ? (rawTransition.value as any).name || '' : ''
)
const enterActiveClass = computed(
  () =>
    (rawTransition.value as any).enterTransition ||
    'animate__animated animate__fadeIn animate__fast enter-active-class'
)
const leaveActiveClass = computed(
  () =>
    (rawTransition.value as any).leaveTransition ||
    'animate__animated animate__slideOutLeft animate__fast leave-active-class'
)
</script>
<template lang="pug">
router-view(v-slot='{ Component, route }')
  //- 使用 Transition 统一管理进入/离开/切换动画（支持 meta.transition 动态配置）
  Transition(
    mode='out-in',
    appear,
    :name='transitionName || undefined',
    :enter-active-class='hasCustomClass ? enterActiveClass : !transitionName ? enterActiveClass : undefined',
    :leave-active-class='hasCustomClass ? leaveActiveClass : !transitionName ? leaveActiveClass : undefined'
  )
    //- 始终使用单一包裹元素，避免子组件多根导致过渡无效
    .full(:key='route.fullPath')
      //- 统一使用 KeepAlive；白名单时 keepAliveNames 为空数组，相当于不缓存
      keep-alive(:include='keepAliveNames')
        component(:is='Component')
</template>
<style lang="scss" scoped>
.enter-active-class {
  animation-duration: 800ms !important;
}
.leave-active-class {
  animation-duration: 200ms !important;
  animation-timing-function: ease-in-out !important;
}
</style>
