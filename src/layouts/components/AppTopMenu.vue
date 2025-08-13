<script setup lang="ts">
import { useLayoutStore, useUserStore } from '@/stores'
import { computed, ref } from 'vue'
const userStore = useUserStore()
const layoutStore = useLayoutStore()
const isLoggedIn = computed(() => userStore.getIsLogin)

/* 控制设置面板显示状态 */
const desktopSettingVisible = ref(false)
const mobileSettingVisible = ref<any>(null)
// 打开/关闭弹出框
const toggleSetting = (type: 'desktop' | 'mobile', event?: any) => {
  if (type === 'desktop') {
    desktopSettingVisible.value = !desktopSettingVisible.value
  } else {
    mobileSettingVisible.value?.toggle(event)
  }
}

const handleLogout = () => {
  userStore.logout()
}

/* 控制侧边栏折叠 */
const sidebarCollapsed = computed(() => layoutStore.getSidebarCollapsed)
const toggleSidebarCollapsed = () => {
  layoutStore.setSidebarCollapsed(!sidebarCollapsed.value)
}
</script>

<template lang="pug">
template(v-if='!isLoggedIn')
  ThemeSwitch
template(v-else)
  .between.gap-gap(class='h100%')
    .c-card-primary.size-1-1.center.animate__animated.animate__lightSpeedInRight.animate__delay-2s(
      @click='toggleSidebarCollapsed'
    )
      .fs-appFontSizex(v-if='layoutStore.getSidebarCollapsed', class='icon-line-md:arrow-open-right')
      .fs-appFontSizex(v-else, class='icon-line-md:arrow-open-left')
    .c-card-primary.size-1-1.center.animate__animated.animate__lightSpeedInRight(
      class='md:hidden',
      @click='toggleSetting("mobile", $event)'
    )
      .fs-appFontSizex(class='icon-line-md:cog-filled')
    .c-card-primary.size-1-1.center.hidden.animate__animated.animate__lightSpeedInRight(
      class='md:block',
      @click='toggleSetting("desktop", $event)'
    )
      .text-ellipsis.fs-appFontSizex(class='icon-line-md:cog-filled')

Drawer(v-model:visible='desktopSettingVisible', position='right', class='w32% lg:w28% xl:w24% xls:w22%')
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

Popover(ref='mobileSettingVisible')
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
