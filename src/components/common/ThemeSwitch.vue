<script setup lang="ts">
import { useColorStore } from '@/stores'
import { computed } from 'vue'

const colorStore = useColorStore()

const modeOptions = computed(() => colorStore.getModeOptions)
const mode = computed(() => colorStore.getMode)

const setMode = (value: Mode) => {
  colorStore.setMode(value)
}
</script>
<template>
  <div class="between-start gap-gap">
    <span>主题</span>
    <ButtonGroup>
      <template
        v-for="item in modeOptions"
        :key="item.value"
      >
        <Button
          :label="item.label"
          severity="help"
          :variant="mode === item.value ? '' : 'outlined'"
          @click="setMode(item.value)"
        />
      </template>
    </ButtonGroup>
  </div>
</template>
