// @/hooks/components/useSchemaForm.ts
/**
 * useSchemaForm.ts
 * - 提供操作 schema + values 的方法（便于外部按需调用）
 * - 例如：addField / removeField / updateField / setValues / reset / submitProgrammatic
 */

import type { Schema, SchemaColumnsItem } from '@/components/modules/schema-form/utils/types'
import { isRef, nextTick, reactive, ref, unref, watch, type Ref } from 'vue'

export interface SchemaFormExpose {
  values: Record<string, any>
  valuesRef?: Record<string, any>
  validate: () => Promise<{ valid: boolean; errors: any }>
  submit: () => void
  reset: () => void
  setFieldValue: (field: string, value: any) => void
  setValues: (newValues: Record<string, any>) => void
}

export interface UseSchemaFormReturn {
  // 响应式数据
  schema: Schema
  // 实时表单值（稳定引用，重置/清空后仍保持更新）
  formValues: Ref<Record<string, any>>

  // 表单整体操作
  getFormData: () => Record<string, any>
  getFormValues: () => Record<string, any>
  resetForm: () => void
  clearForm: () => void
  submitForm: () => Promise<{ valid: boolean; errors: any }>
  validateForm: () => Promise<{ valid: boolean; errors: any }>

  // 表单项操作
  addField: (field: SchemaColumnsItem, index?: number | 'first' | 'last' | null) => boolean
  removeField: (fieldName: string) => boolean
  updateField: (fieldName: string, updates: Partial<SchemaColumnsItem>) => boolean
  getField: (fieldName: string) => SchemaColumnsItem | undefined
  getFieldValue: (fieldName: string) => any
  setFieldValue: (fieldName: string, value: any) => void
  moveField: (fieldName: string, newIndex: number) => boolean

  // 批量操作
  setValues: (newValues: Record<string, any>) => void
  getValues: () => Record<string, any>

  // 工具方法
  hasField: (fieldName: string) => boolean
  getFieldIndex: (fieldName: string) => number
}

export const useSchemaForm = ({
  formRef,
  initialSchema,
}: {
  formRef: Ref<SchemaFormExpose | undefined>
  initialSchema: Schema
}): UseSchemaFormReturn => {
  // 响应式 schema 数据 - 使用类型断言避免复杂的类型推断
  const schema = reactive(initialSchema as any) as Schema

  // 提供一个稳定的、可深度追踪的表单值引用，避免直接监听 formRef?.values 带来的引用丢失问题
  const formValuesRef = ref<Record<string, any>>({})

  // 内部同步方法：从 formRef 拉取一次并写入稳定引用
  const syncFormValues = () => {
    const current = unref(formRef)?.values || {}
    formValuesRef.value = { ...current }
  }

  // 获取表单值
  const getFormValues = () => {
    return unref(formRef)?.values || formValuesRef.value || {}
  }

  // 获取表单值（必须通过校验）
  const getFormData = async () => {
    const { valid } = await submitForm()
    if (valid) {
      return unref(formRef)?.values || formValuesRef.value || {}
    }
  }

  // 深度监听内部表单值并同步到稳定引用，确保在 reset/clear 之后仍能持续更新
  // 添加防抖机制，避免频繁更新
  let debounceTimer: NodeJS.Timeout | null = null
  watch(
    // 优先监听 SchemaForm 暴露的 valuesRef（它在 reset 时也会被刷新）
    () => {
      const exposed: any = unref(formRef)
      const source = exposed?.valuesRef ?? exposed?.values
      // 若是 ref，则返回其 .value 以便依赖收集到值变化
      return isRef(source) ? source.value : source
    },
    newVal => {
      // 防抖处理，避免频繁更新
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      debounceTimer = setTimeout(() => {
        // 解包可能的 ref，再复制一份，确保引用稳定，便于外部 watch
        const unwrapped = isRef(newVal) ? (newVal as any).value : newVal
        formValuesRef.value = { ...((unwrapped as any) || {}) }
        debounceTimer = null
      }, 100) // 100ms 防抖
    },
    { deep: true, immediate: true }
  )

  // 重置表单
  const resetForm = () => {
    const form = unref(formRef)
    form?.reset()
    // 下一帧从实际表单取值刷新稳定引用
    nextTick(() => {
      // 优先从 SchemaForm 的 valuesRef 同步（确保 reset 后也能拿到最新引用）
      const exposed: any = unref(formRef)
      if (exposed && exposed.valuesRef) {
        const unwrapped = isRef(exposed.valuesRef) ? exposed.valuesRef.value : exposed.valuesRef
        formValuesRef.value = { ...(unwrapped || {}) }
      } else {
        syncFormValues()
      }
    })
  }

  // 清空表单
  const clearForm = () => {
    const form = unref(formRef)
    if (!form) {
      return
    }
    const emptyValues: Record<string, any> = {}
    // 基于 schema.columns 将所有字段值清空，而非恢复默认值
    schema.columns.forEach(column => {
      emptyValues[column.field] = undefined
    })
    form.setValues(emptyValues)
    // 同步一次稳定引用
    nextTick(() => {
      syncFormValues()
    })
  }

  // 提交表单
  const validateForm = async () => {
    const form = unref(formRef)
    if (form && typeof form.validate === 'function') {
      return await form.validate()
    }
    return { valid: true, errors: {} }
  }

  const submitForm = async () => {
    unref(formRef)?.submit()
    const result = await validateForm()
    if (result.valid) {
      return result
    }
    return { valid: false, errors: result.errors }
  }

  // 添加字段
  const addField = (
    field: SchemaColumnsItem,
    index?: number | 'first' | 'last' | null
  ): boolean => {
    try {
      // 验证字段配置
      if (!field || !field.field || !field.component) {
        console.error('添加字段失败: 字段配置不完整', { field })
        return false
      }

      // 检查字段名是否已存在
      if (hasField(field.field)) {
        console.warn(`字段名 "${field.field}" 已存在`)
        return false
      }

      let insertIndex: number

      if (typeof index === 'number') {
        insertIndex = Math.max(0, Math.min(index, schema.columns.length))
      } else if (index === 'first') {
        insertIndex = 0
      } else if (index === 'last') {
        insertIndex = schema.columns.length
      } else {
        insertIndex = schema.columns.length
      }

      schema.columns.splice(insertIndex, 0, field)

      // 写入默认值并同步一次稳定引用（若外部未立即触发 setValue）
      const form = unref(formRef)
      if (form) {
        const current = form.values || {}
        const nextValues = { ...current }
        if (field.defaultValue !== undefined) {
          nextValues[field.field] = field.defaultValue
        } else if (!(field.field in nextValues)) {
          nextValues[field.field] = undefined
        }
        form.setValues?.(nextValues)
      }
      nextTick(() => {
        syncFormValues()
      })
      return true
    } catch (error) {
      console.error('添加字段失败:', error, { field, index })
      return false
    }
  }

  // 删除字段
  const removeField = (fieldName: string): boolean => {
    try {
      const index = getFieldIndex(fieldName)
      if (index >= 0) {
        schema.columns.splice(index, 1)
        // 同步清理已删除字段的表单值，避免残留在 values 中
        const form = unref(formRef)
        if (form && typeof form.setValues === 'function') {
          const current = form.values || {}
          if (fieldName in current) {
            const nextValues = { ...current }
            delete nextValues[fieldName]
            form.setValues(nextValues)
          }
        }
        nextTick(() => {
          syncFormValues()
        })
        return true
      }
      return false
    } catch (error) {
      console.error('删除字段失败:', error)
      return false
    }
  }

  // 更新字段
  const updateField = (fieldName: string, updates: Partial<SchemaColumnsItem>): boolean => {
    try {
      const field = getField(fieldName)
      if (field) {
        Object.assign(field, updates)
        nextTick(() => {
          syncFormValues()
        })
        return true
      }
      return false
    } catch (error) {
      console.error('更新字段失败:', error)
      return false
    }
  }

  // 获取字段配置
  const getField = (fieldName: string): SchemaColumnsItem | undefined => {
    return schema.columns.find(column => column.field === fieldName)
  }

  // 获取字段值
  const getFieldValue = (fieldName: string): any => {
    const values = getFormValues()
    return values[fieldName]
  }

  // 设置字段值
  const setFieldValue = (fieldName: string, value: any) => {
    unref(formRef)?.setFieldValue(fieldName, value)
  }

  // 移动字段
  const moveField = (fieldName: string, newIndex: number): boolean => {
    try {
      const currentIndex = getFieldIndex(fieldName)
      if (currentIndex >= 0 && newIndex >= 0 && newIndex < schema.columns.length) {
        const field = schema.columns.splice(currentIndex, 1)[0]
        schema.columns.splice(newIndex, 0, field)
        nextTick(() => {
          syncFormValues()
        })
        return true
      }
      return false
    } catch (error) {
      console.error('移动字段失败:', error)
      return false
    }
  }

  // 批量设置值
  const setValues = (newValues: Record<string, any>) => {
    unref(formRef)?.setValues(newValues)
  }

  // 获取所有值
  const getValues = () => {
    return getFormValues()
  }

  // 检查字段是否存在
  const hasField = (fieldName: string): boolean => {
    return schema.columns.some(column => column.field === fieldName)
  }

  // 获取字段索引
  const getFieldIndex = (fieldName: string): number => {
    return schema.columns.findIndex(column => column.field === fieldName)
  }

  return {
    // 响应式数据
    schema: schema as Schema,
    formValues: formValuesRef,

    // 表单整体操作
    getFormData,
    getFormValues,
    resetForm,
    clearForm,
    submitForm,
    validateForm,

    // 表单项操作
    addField,
    removeField,
    updateField,
    getField,
    getFieldValue,
    setFieldValue,
    moveField,

    // 批量操作
    setValues,
    getValues,

    // 工具方法
    hasField,
    getFieldIndex,
  }
}
