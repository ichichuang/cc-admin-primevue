<script setup lang="ts">
import { useSizeStore } from '@/stores'
import { computed } from 'vue'

const sizeStore = useSizeStore()

/* 尺寸变量配置相关 gap */
const gapOptions = computed(() => sizeStore.getGapOptions)
const gap = computed(() => sizeStore.getGap)

const setGap = (value: GapOptions['key']) => {
  sizeStore.setGap(value)
}
</script>
<template>
  <ButtonGroup>
    <template
      v-for="item in gapOptions"
      :key="item.value"
    >
      <Button
        :label="item.label"
        :severity="gap === item.key ? 'primary' : 'secondary'"
        @click="setGap(item.key)"
      />
    </template>
  </ButtonGroup>
</template>
