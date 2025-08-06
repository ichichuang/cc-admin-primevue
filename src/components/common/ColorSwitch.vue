<script setup lang="ts">
import { useColorStore } from '@/stores'
import { computed, ref, watch } from 'vue'

const colorStore = useColorStore()

const mode = computed(() => colorStore.getMode)
const themeOptions = computed(() => colorStore.getThemeOptions)
const themeValue = ref(colorStore.getThemeValue)
watch(mode, () => {
  themeValue.value = colorStore.getThemeValue
})

const setTheme = ({ value }: { value: ThemeColor['value'] }) => {
  colorStore.setTheme(value)
}
</script>
<template>
  <div class="between">
    <Select
      v-model="themeValue"
      :options="themeOptions"
      option-label="label"
      option-value="value"
      @change="setTheme"
    />
  </div>
</template>
