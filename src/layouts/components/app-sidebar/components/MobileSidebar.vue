<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import type { MenuItem } from 'primevue/menuitem'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  items: MenuItem[]
  componentsProps: Record<string, any>
}>()

const router = useRouter()

const layoutStore = useLayoutStore()

const mobileSidebarVisible = computed(() => layoutStore.getMobileSidebarVisible)

// 监听路由跳转则关闭移动端菜单
router.beforeEach(() => {
  layoutStore.setMobileSidebarVisible(false)
})
</script>
<template lang="pug">
.full
  //- 移动端菜单
  AnimateWrapper.fixed.t-gapl.l-gapl.z-999.wa.ha(
    :show='mobileSidebarVisible',
    enter='slideInLeft',
    leave='fadeOutLeft',
    duration='400ms'
  )
    .bg-primary100.py-paddingl.px-padding.rounded-rounded
      ScrollbarWrapper(
        :color-scheme='{ thumbColor: "var(--primary100)", thumbHoverColor: "var(--primary200)" }',
        :thumb-width='6'
      )
        .rounded-rounded.max-w-60vw.min-w-44vw.h-contentHeight.select-none
          PrimeMenu(
            :type='"panel"',
            :items='props.items',
            :components-props='props.componentsProps'
          )
  //- 遮罩
  AnimateWrapper.fixed.t-0.l-0.z-3(:show='mobileSidebarVisible', enter='fadeIn', leave='fadeOut')
    .full.opacity-50(@click='layoutStore.setMobileSidebarVisible(false)')
</template>
<style lang="scss" scope></style>
