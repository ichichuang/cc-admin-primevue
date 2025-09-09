<!-- @/components/schema-form/components/StepsHeader.vue -->
<template>
  <div class="mb-4">
    <div class="flex gap-2">
      <Button
        v-for="(step, index) in steps"
        :key="index"
        @click="$emit('step-change', index)"
        :severity="index === activeStep ? 'primary' : 'secondary'"
      >
        <span class="fs-appFontSizes">{{ index + 1 }}. {{ step.title }}</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepConfig } from '../utils/types'

defineProps<{
  steps: StepConfig[]
  activeStep: number
}>()

defineEmits<{
  'step-change': [index: number]
}>()
</script>
