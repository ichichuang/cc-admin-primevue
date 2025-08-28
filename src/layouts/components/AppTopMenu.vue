<script setup lang="ts">
import { throttle } from '@/common'
import { t } from '@/locales'
import { useLayoutStore, useUserStore } from '@/stores'
import { computed, ref } from 'vue'
const userStore = useUserStore()
const layoutStore = useLayoutStore()
const isLoggedIn = computed(() => userStore.getIsLogin)
const currentLayoutMode = computed(() => layoutStore.getCurrentLayout)

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
const toggleSidebarCollapsed = throttle(() => {
  layoutStore.setSidebarCollapsed(!sidebarCollapsed.value)
}, 100)

/* 控制移动端菜单显示 */
const mobileSidebarVisible = computed(() => layoutStore.getMobileSidebarVisible)
const toggleMobileMenu = () => {
  layoutStore.setMobileSidebarVisible(!mobileSidebarVisible.value)
}
</script>

<template lang="pug">
template(v-if='!isLoggedIn')
  ThemeSwitch
template(v-else)
  template(v-if='currentLayoutMode === "fullscreen"')
    ThemeSwitch
    LocalesSwitch
    ColorSwitch.fixed.b-gapl.r-gapl
  template(v-else)
    .between.gap-gap(class='h100%')
      //- 桌面端
      .hidden.c-card-primary.shadow-none.size-1-1.center(
        class='md:block',
        @click='toggleSidebarCollapsed',
        v-if='currentLayoutMode === "admin"'
      )
        .fs-appFontSizex(v-if='layoutStore.getSidebarCollapsed', class='icon-line-md:arrow-open-right')
        .fs-appFontSizex(v-else, class='icon-line-md:arrow-open-left')
      .c-card-primary.shadow-none.size-1-1.center.hidden(
        class='md:block',
        @click='toggleSetting("desktop", $event)'
      )
        .text-ellipsis.fs-appFontSizex(class='icon-line-md:cog-filled')
      //- 移动端
      .c-card-primary.shadow-none.size-1-1.center(class='md:hidden', @click='toggleMobileMenu')
        .fs-appFontSizex(class='icon-line-md:grid-3-filled')
      .c-card-primary.shadow-none.size-1-1.center(
        class='md:hidden',
        @click='toggleSetting("mobile", $event)'
      )
        .fs-appFontSizex(class='icon-line-md:cog-filled')

//- 桌面端设置面板抽屉
Drawer(v-model:visible='desktopSettingVisible', position='right', class='w32% lg:w28% xl:w24% xls:w22%')
  template(#header)
    .font-bold.fs-appFontSizex {{ t('common.settings.title') }}
  .full.gap-24.between-col.start-col.relative
    .between-start.gap-gap
      span {{ t('common.settings.theme') }}
      ThemeSwitch
    .between-start.gap-gap
      span {{ t('common.settings.size') }}
      SizeSwitch
    .between-start.gap-gap
      span {{ t('common.settings.rounded') }}
      RoundSwitch
    .between-start.gap-gap
      span {{ t('common.settings.padding') }}
      PaddingSwitch
    .between-start.gap-gap
      span {{ t('common.settings.language') }}
      LocalesSwitch
    ColorSwitch.absolute.b-gap.r-gap
    //- FontSizeSwitchDesktop
  template(#footer)
    .flex.items-center.gap-gapl.px-paddingl
      Button.flex-auto(:label='t("common.settings.systemManagement")')
      Button.flex-auto(
        :label='t("common.settings.logout")',
        severity='danger',
        variant='text',
        raised,
        @click='handleLogout'
      )

//- 移动端设置面板弹出框
Popover(ref='mobileSettingVisible')
  .gap-gap.between-col.start-col.w-60vw(class='sm:w-40vw')
    .between-start.gap-gap
      span {{ t('common.settings.theme') }}
      ThemeSwitch
    //- ColorSwitch.absolute.b-gap.r-gap
    SizeSwitch
    PaddingSwitch
    RoundSwitch
    LocalesSwitch
    //- FontSizeSwitchMobile
    Button.flex-auto(
      :label='t("common.settings.logout")',
      severity='danger',
      variant='text',
      raised,
      @click='handleLogout'
    )
</template>
<style lang="scss" scoped></style>
