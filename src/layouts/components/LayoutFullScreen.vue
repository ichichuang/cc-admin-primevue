<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const showMenu = computed(() => layoutStore.getShowMenu)
</script>

<template lang="pug">
.full
  template(v-if='showMenu')
    .px-paddingx.py-padding.rounded-xl.center.gap-gap.fixed.t-gap.r-gapl
      AppTopMenu
  AppContainer
</template>
