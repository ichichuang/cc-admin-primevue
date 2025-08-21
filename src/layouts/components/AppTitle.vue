<script setup lang="ts">
import { useLayoutStore } from '@/stores'
import { env } from '@/utils'
import { computed, nextTick, ref, watch } from 'vue'

const layoutStore = useLayoutStore()
const title = env.appTitle

const isCollapsed = computed(() => layoutStore.getSidebarCollapsed)

const flag = ref(false)
watch(
  () => isCollapsed.value,
  () => {
    flag.value = false
    nextTick(() => {
      setTimeout(() => {
        flag.value = true
      }, 0)
    })
  },
  { immediate: true }
)
</script>
<template lang="pug">
.select-none
  template(v-if='isCollapsed')
    AnimateWrapper(:show='flag')
      .p-padding.center
        Image(src='/face.png')
  template(v-else)
    AnimateWrapper(:show='flag')
      span {{ title }}
</template>
<style lang="scss" scope></style>
