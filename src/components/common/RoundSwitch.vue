<script setup lang="ts">
import { useSizeStore, type RoundedOptions } from '@/stores'
import { computed } from 'vue'

const sizeStore = useSizeStore()

/* 尺寸变量配置相关 rounded */
const roundedOptions = computed(() => sizeStore.getRoundedOptions)
const rounded = computed(() => sizeStore.getRounded)

const setRounded = (value: RoundedOptions['key']) => {
  sizeStore.setRounded(value)
}
</script>
<template>
  <ButtonGroup>
    <template
      v-for="item in roundedOptions"
      :key="item.value"
    >
      <Button
        :label="item.label"
        :severity="rounded === item.key ? 'primary' : 'secondary'"
        @click="setRounded(item.key)"
      />
    </template>
  </ButtonGroup>
</template>
