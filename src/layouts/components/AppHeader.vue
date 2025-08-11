<script setup lang="ts">
import { useLayoutStoreWithOut } from '@/stores'
import { computed } from 'vue'

const layoutStore = useLayoutStoreWithOut()

const showBreadcrumb = computed(() => layoutStore.getShowBreadcrumb)
</script>
<template lang="pug">
.full.between
  .full
    AppBreadcrumb(v-if='showBreadcrumb')
  AppTopMenu
</template>
