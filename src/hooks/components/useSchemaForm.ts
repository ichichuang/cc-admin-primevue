// @/hooks/components/useSchemaForm.ts
/**
 * useSchemaForm.ts
 * - 提供操作 schema + values 的方法（便于外部按需调用）
 * - 例如：addField / removeField / updateField / setValues / reset / submitProgrammatic
 */

import type { Schema, SchemaColumnsItem } from '@/components/modules/schema-form/utils/types'
import { nextTick, reactive, unref, type Ref } from 'vue'

export interface SchemaFormExpose {
  values: Record<string, any>
  validate: () => Promise<{ valid: boolean; errors: any }>
  submit: () => void
  reset: () => void
  setFieldValue: (field: string, value: any) => void
  setValues: (newValues: Record<string, any>) => void
}

export interface UseSchemaFormReturn {
  // 响应式数据
  schema: Schema

  // 表单整体操作
  getFormValues: () => Record<string, any>
  validateForm: () => Promise<{ valid: boolean; errors: any }>
  resetForm: () => void
  clearForm: () => void
  submitForm: () => void

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

export const useSchemaForm = (
  formRef: Ref<SchemaFormExpose | undefined>,
  initialSchema: Schema
): UseSchemaFormReturn => {
  // 响应式 schema 数据 - 使用类型断言避免复杂的类型推断
  const schema = reactive(initialSchema as any) as Schema

  // 获取表单值
  const getFormValues = () => {
    return unref(formRef)?.values || {}
  }

  // 验证表单
  const validateForm = async () => {
    await nextTick()
    return unref(formRef)?.validate() || { valid: true, errors: {} }
  }

  // 重置表单
  const resetForm = () => {
    unref(formRef)?.reset()
  }

  // 清空表单
  const clearForm = () => {
    // 通过设置所有字段为空值来清空表单
    const form = unref(formRef)
    if (form) {
      const currentValues = form.values
      const emptyValues: Record<string, any> = {}

      // 将所有字段设置为空值
      Object.keys(currentValues).forEach(key => {
        emptyValues[key] = ''
      })

      form.setValues(emptyValues)
    }
  }

  // 提交表单
  const submitForm = () => {
    unref(formRef)?.submit()
  }

  // 添加字段
  const addField = (
    field: SchemaColumnsItem,
    index?: number | 'first' | 'last' | null
  ): boolean => {
    try {
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
      return true
    } catch (error) {
      console.error('添加字段失败:', error)
      return false
    }
  }

  // 删除字段
  const removeField = (fieldName: string): boolean => {
    try {
      const index = getFieldIndex(fieldName)
      if (index >= 0) {
        schema.columns.splice(index, 1)
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

    // 表单整体操作
    getFormValues,
    validateForm,
    resetForm,
    clearForm,
    submitForm,

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
