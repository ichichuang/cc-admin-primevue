<script setup lang="ts">
import AppFooter from '@/layouts/components/AppFooter.vue'
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
const layoutStore = useLayoutStore()

const showHeader = computed(() => layoutStore.getShowHeader)
const showFooter = computed(() => layoutStore.getShowFooter)
const isPageLoading = computed(() => layoutStore.getIsPageLoading)
</script>

<template lang="pug">
main.container
  // 头部
  template(v-if='showHeader')
    header.h-headerHeight.px-padding
      AppHeader

  // 内容区域
  .full.h-contentsHeight.c-border.border-x-none
    .container.relative.py-padding(class='md:py-paddingx xxl:py-paddingl')
      AppContainer
      .absolute.t-0.r-0.l-0.b-0.z-1.full.center(v-if='isPageLoading')
        Loading.z-2
        .absolute.full.bg-bg200.opacity-50.z-0

  // 底部
  template(v-if='showFooter')
    footer.h-footerHeight.bg-bg200
      AppFooter
</template>
