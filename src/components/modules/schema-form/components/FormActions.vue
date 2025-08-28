<!-- @/components/schema-form/components/FormActions.vue -->
<template>
  <div class="between-end my-gap gap-gap">
    <Button
      type="button"
      severity="secondary"
      label="重置"
      @click="$emit('reset', form)"
    />
    <Button
      type="submit"
      severity="primary"
      label="提交"
      @click="$emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  form: any
}>()

defineEmits<{
  reset: [form: any]
  submit: []
}>()
</script>
