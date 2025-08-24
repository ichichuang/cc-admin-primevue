<script setup lang="ts">
import { useColorStore } from '@/stores'
import { computed } from 'vue'

const colorStore = useColorStore()

const themeOptions = computed(() => colorStore.getThemeOptions)
const themeValue = computed(() => colorStore.getThemeValue)

const setTheme = ({ value }: { value: ThemeColor['value'] }) => {
  colorStore.setTheme(value)
}
const items = computed(() => {
  return themeOptions.value.map(item => ({
    label: item.label,
    value: item.value,
    color: item.themeColors.primary100,
    icon: 'pi pi-check',
    command: () => setTheme(item),
  }))
})
</script>
<template lang="pug">
SpeedDial.flex(:model='items', direction='up', :transition-delay='80', class='items-end!')
  // 按钮插槽
  template(#button='{ toggleCallback }')
    .c-card-accent.size-1-1(@click='toggleCallback')
      .fs-appFontSizel(class='icon-line-md:cookie-filled')

  // 列表项插槽
  template(#item='{ item, toggleCallback }')
    .w-160.between(
      :class='item.value === themeValue ? "c-card-accent-active" : "c-card"',
      @click='toggleCallback'
    )
      .w-14.h-14.rounded-full(:style='{ background: item.color }')
      .flex-1.text-ellipsis {{ item.label }}

  Toast
</template>
