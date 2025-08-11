<script setup lang="ts">
import ColorSwitch from '@/components/common/ColorSwitch.vue'
import FontSizeSwitchDesktop from '@/components/common/FontSizeSwitchDesktop.vue'
import FontSizeSwitchMobile from '@/components/common/FontSizeSwitchMobile.vue'
import LocalesSwitch from '@/components/common/LocalesSwitch.vue'
import PaddingSwitch from '@/components/common/PaddingSwitch.vue'
import RoundSwitch from '@/components/common/RoundSwitch.vue'
import SizeSwitch from '@/components/common/SizeSwitch.vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'
import { useLayoutStore, useUserStore } from '@/stores'
import { computed, ref } from 'vue'
const userStore = useUserStore()
const layoutStore = useLayoutStore()
const isLoggedIn = computed(() => userStore.getIsLogin)
// 抽屉
const visible = ref(false)
// 弹出框
const op = ref<any>(null)
// 打开/关闭弹出框
const toggleSetting = (type: 'op' | 'visible', event?: any) => {
  if (type === 'op') {
    op.value?.toggle(event)
  } else {
    visible.value = !visible.value
  }
}

const handleLogout = () => {
  userStore.logout()
}

/* 控制侧边栏折叠 */
const toggleSidebarCollapsed = () => {
  layoutStore.setSidebarCollapsed(!layoutStore.getSidebarCollapsed)
}
</script>

<template lang="pug">
template(v-if='!isLoggedIn')
  ThemeSwitch
template(v-else)
  .between.gap-gap(class='h100%')
    .c-card-primary.size-1-1.center.animate__animated.animate__bounceInLeft.animate__delay-2s(
      @click='toggleSidebarCollapsed'
    )
      .fs-appFontSizex(v-if='layoutStore.getSidebarCollapsed', class='icon-line-md:arrow-open-right')
      .fs-appFontSizex(v-else, class='icon-line-md:arrow-open-left')
    .c-card-primary.size-1-1.center.animate__animated.animate__bounceInLeft(
      class='md:hidden',
      @click='toggleSetting("op", $event)'
    )
      .fs-appFontSizex(class='icon-line-md:cog-filled')
    .c-card-primary.size-1-1.center.hidden.animate__animated.animate__bounceInLeft(
      class='md:block',
      @click='toggleSetting("visible", $event)'
    )
      .text-ellipsis.fs-appFontSizex(class='icon-line-md:cog-filled')

Drawer(v-model:visible='visible', position='right', class='w32% lg:w28% xl:w24% xls:w22%')
  template(#header)
    .font-bold.fs-appFontSizex 设置
  .full.gap-24.between-col.start-col.relative
    .between-start.gap-gap
      span 主题
      ThemeSwitch
    ColorSwitch
    SizeSwitch
    RoundSwitch
    PaddingSwitch
    LocalesSwitch
    FontSizeSwitchDesktop
  template(#footer)
    .flex.items-center.gap-gapl.px-paddingl
      Button.flex-auto(label='管理系统')
      Button.flex-auto(
        label='退出系统',
        severity='danger',
        variant='text',
        raised,
        @click='handleLogout'
      )

Popover(ref='op')
  .w-400.gap-gap.between-col.start-col
    ThemeSwitch
    ColorSwitch
    SizeSwitch
    PaddingSwitch
    RoundSwitch
    LocalesSwitch
    FontSizeSwitchMobile
</template>
<style lang="scss" scoped></style>
