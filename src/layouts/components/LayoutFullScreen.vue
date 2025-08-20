<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const showMenu = computed(() => layoutStore.getShowMenu)
</script>

<template lang="pug">
main.full
  template(v-if='showMenu')
    .fixed.t-gapl.r-gapl.between.gap-gap.z-2
      AppTopMenu
  AppContainer
</template>
