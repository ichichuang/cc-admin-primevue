<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const showMenu = computed(() => layoutStore.getShowMenu)
</script>

<template lang="pug">
main.container
  template(v-if='showMenu')
    .between.gap-gap.fixed.t-gap.r-gap
      AppTopMenu
  AppContainer
</template>
