<script setup lang="ts">
import { useColorStore, type Mode } from '@/stores'
import { computed } from 'vue'

const colorStore = useColorStore()

const modeOptions = computed(() => colorStore.getModeOptions)
const mode = computed(() => colorStore.getMode)

const setMode = (value: Mode) => {
  colorStore.setMode(value)
}
</script>
<template>
  <ButtonGroup>
    <template
      v-for="item in modeOptions"
      :key="item.value"
    >
      <Button
        :label="item.label"
        :severity="mode === item.value ? 'primary' : 'secondary'"
        @click="setMode(item.value)"
      />
    </template>
  </ButtonGroup>
</template>
