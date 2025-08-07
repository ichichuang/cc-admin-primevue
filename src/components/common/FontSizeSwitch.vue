<script setup lang="ts">
import { useSizeStore } from '@/stores'
import { computed } from 'vue'

const sizeStore = useSizeStore()

/* 尺寸变量配置相关 fontSize */
const fontSizeOptions = computed(() => sizeStore.getFontSizeOptions)
const fontSize = computed(() => sizeStore.getFontSize)

const setFontSize = (value: FontSizeOptions['key']) => {
  sizeStore.setFontSize(value)
}
</script>
<template>
  <ButtonGroup>
    <template
      v-for="item in fontSizeOptions"
      :key="item.value"
    >
      <Button
        :label="item.label"
        :severity="fontSize === item.key ? 'primary' : 'secondary'"
        @click="setFontSize(item.key)"
      />
    </template>
  </ButtonGroup>
</template>
