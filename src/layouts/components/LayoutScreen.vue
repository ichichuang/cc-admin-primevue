<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'
import AppFooter from './AppFooter.vue'
const layoutStore = useLayoutStore()

const showHeader = computed(() => layoutStore.getShowHeader)
const showFooter = computed(() => layoutStore.getShowFooter)
</script>

<template lang="pug">
.container
  // 头部
  template(v-if='showHeader')
    AppTopMenu
  // 内容区域
  main.h-contentsHeight
    AppContainer
  // 底部
  template(v-if='showFooter')
    footer.h-footerHeight
      AppFooter
</template>
