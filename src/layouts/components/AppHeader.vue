<script setup lang="ts">
import { useLayoutStoreWithOut } from '@/stores'
import { computed } from 'vue'

const layoutStore = useLayoutStoreWithOut()

const showBreadcrumb = computed(() => layoutStore.getShowBreadcrumb)
</script>
<template lang="pug">
.full.between
  .center.hidden(class='sm:block')
    AppBreadcrumb(v-if='showBreadcrumb')
  AppTitle(class='sm:hidden')
  AppTopMenu
</template>
