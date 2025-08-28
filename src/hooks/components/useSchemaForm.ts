// @/hooks/components/useSchemaForm.ts
/**
 * useSchemaForm.ts
 * - 提供操作 schema + values 的方法（便于外部按需调用）
 * - 例如：addField / removeField / updateField / setValues / reset / submitProgrammatic
 */

import type { FieldSchema, Schema } from '@/components/modules/schema-form/utils/types'
import { reactive, ref } from 'vue'

export function useSchemaForm(initialSchema: Schema, initialValues: Record<string, any> = {}): any {
  const schema = reactive<Schema>({ ...initialSchema })
  const values = ref<Record<string, any>>({ ...initialValues })

  // 引用 PrimeVue Form 实例（可在 SchemaForm.vue 中注入）
  const formRef = ref<any>(null)

  function setFormRef(f: any) {
    formRef.value = f
  }

  // field 操作
  function addField(field: FieldSchema, index?: number) {
    if (typeof index === 'number') {
      schema.fields.splice(index, 0, field)
    } else {
      schema.fields.push(field)
    }
  }
  function removeField(name: string) {
    const idx = schema.fields.findIndex(f => f.name === name)
    if (idx >= 0) {
      schema.fields.splice(idx, 1)
    }
  }
  function updateField(name: string, patch: Partial<FieldSchema>) {
    const f = schema.fields.find(f => f.name === name)
    if (f) {
      Object.assign(f, patch)
    }
  }

  // values 操作
  function setValues(v: Record<string, any>) {
    values.value = { ...v }
  }
  function setValue(key: string, v: any) {
    values.value[key] = v
  }
  function getValue(key: string) {
    return values.value[key]
  }

  function reset(initial?: Record<string, any>) {
    values.value = initial ? { ...initial } : {}
    // 如果有 Form 实例可调用 reset
    if (formRef.value && formRef.value.reset) {
      formRef.value.reset()
    }
  }

  async function submitProgrammatic() {
    if (!formRef.value) {
      throw new Error('formRef is not bound')
    }
    // PrimeVue Forms 提供 submit 方法
    const r = await formRef.value.submit?.()
    return r
  }

  return {
    schema,
    values,
    setFormRef,
    addField,
    removeField,
    updateField,
    setValues,
    setValue,
    getValue,
    reset,
    submitProgrammatic,
  }
}
