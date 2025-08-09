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
<template>
  <SpeedDial
    :model="items"
    direction="up"
    :transition-delay="80"
    class="absolute b-gap r-gap flex items-end!"
  >
    <template #button="{ toggleCallback }">
      <div
        class="c-card size-1-1"
        @click="toggleCallback"
      >
        <div class="icon-line-md:cookie-filled fs-appFontSizel"></div>
      </div>
    </template>
    <template #item="{ item, toggleCallback }">
      <div
        class="w-160 between"
        :class="item.value === themeValue ? 'c-card-active' : 'c-card shadow-tm'"
        @click="toggleCallback"
      >
        <div
          class="w-14 h-14 rounded-full"
          :style="{ background: item.color }"
        ></div>
        <div class="flex-1 text-ellipsis">
          {{ item.label }}
        </div>
      </div>
    </template>
  </SpeedDial>
  <Toast />
</template>
