<script setup lang="ts">
import type { Schema } from '@/components/modules/schema-form/utils/types'
import { ref } from 'vue'

const formData = ref<Record<string, any>>({})

const handleSubmit = (values: Record<string, any>) => {
  console.log('表单提交:', values)
}

const schema: Schema = {
  columns: [
    {
      field: 'autoComplete',
      label: 'AutoComplete',
      component: 'AutoComplete',
      props: {
        onComplete: (e: any) => {
          console.log(e)
          return ['Apple', 'Banana', 'Cherry']
        },
      },
    },
    {
      field: 'inputText',
      label: '用户名',
      component: 'InputText',
      placeholder: '请输入用户名',
      rules: 'required|min:3|max:20',
      help: '用户名长度为3-20个字符',
    },
  ],
  layout: {
    labelAlign: 'left',
    labelPosition: 'right',
    labelWidth: '140px',
    showLabel: true,
  },
}
</script>
<template lang="pug">
.c-border.p-padding
  SchemaForm(:schema='schema', v-model='formData', @submit='handleSubmit')
</template>
<style lang="scss" scope></style>
