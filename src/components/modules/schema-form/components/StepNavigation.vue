<!-- @/components/schema-form/components/StepNavigation.vue -->
<template>
  <div class="col-span-12 between-start gap-gap">
    <Button
      type="button"
      severity="secondary"
      label="上一步"
      :disabled="activeStep === 0"
      @click="$emit('prev')"
    />
    <div>
      <Button
        v-if="activeStep < totalSteps - 1"
        type="button"
        severity="primary"
        label="下一步"
        @click="() => $emit('next', form)"
      />
      <Button
        v-else
        type="submit"
        severity="primary"
        label="提交"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  activeStep: number
  totalSteps: number
  form: any
}>()

defineEmits<{
  next: [form: any]
  prev: []
}>()
</script>
