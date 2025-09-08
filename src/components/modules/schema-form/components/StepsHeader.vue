<!-- @/components/schema-form/components/StepsHeader.vue -->
<template>
  <div class="mb-4">
    <div class="flex gap-2">
      <button
        v-for="(step, index) in steps"
        :key="index"
        type="button"
        @click="$emit('step-change', index)"
        :class="[
          'px-3 py-1 rounded-full',
          index === activeStep
            ? 'bg-primary text-white'
            : 'border border-gray-300 hover:bg-gray-50',
        ]"
      >
        <span class="text-sm">{{ index + 1 }}. {{ step.title }}</span>
      </button>
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
