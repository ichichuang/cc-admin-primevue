<script setup lang="ts">
import AnimateWrapper from '@/components/animate-wrapper'
import { useLayoutStore, useUserStore } from '@/stores'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from './components/LayoutAdmin.vue'
import FullScreenLayout from './components/LayoutFullScreen.vue'
import ScreenLayout from './components/LayoutScreen.vue'

const route = useRoute()
const layoutStore = useLayoutStore()
const userStore = useUserStore()
const isLoading = computed(() => layoutStore.getIsLoading)
const isLoggedIn = computed(() => userStore.getIsLogin)

// 根据路由meta获取布局模式，默认为admin
const currentLayoutMode = computed<LayoutMode>(() => {
  const routeLayout = route.meta?.parent as LayoutMode
  return routeLayout || 'admin'
})

// 同步更新store中的布局模式
layoutStore.setCurrentLayout(currentLayoutMode.value)
</script>

<template lang="pug">
template(v-if='isLoading')
  .container.fixed.center.t-0.r-0.l-0.b-0.z-9999
    Loading

//- AnimateWrapper(:show='!isLoading', enter='fadeIn', delay='0')
template(v-if='!isLoading')
  AnimateWrapper(
    :show='currentLayoutMode === "fullscreen"',
    enter='lightSpeedInLeft',
    leave='lightSpeedOutRight',
    duration='800ms',
    delay='0'
  )
    component(:is='FullScreenLayout', v-if='currentLayoutMode === "fullscreen"')

  AnimateWrapper(
    :show='currentLayoutMode === "screen" && isLoggedIn',
    enter='lightSpeedInLeft',
    leave='lightSpeedOutRight',
    duration='600ms',
    delay='600ms'
  )
    component(:is='ScreenLayout', v-if='currentLayoutMode === "screen" && isLoggedIn')

  AnimateWrapper(
    :show='currentLayoutMode === "admin" && isLoggedIn',
    enter='lightSpeedInLeft',
    leave='lightSpeedOutRight',
    duration='600ms',
    delay='600ms'
  )
    component(:is='AdminLayout', v-if='currentLayoutMode === "admin" && isLoggedIn')
</template>
