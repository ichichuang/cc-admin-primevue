<!-- @/components/schema-form/SchemaForm.vue -->
<template>
  <div
    class="full"
    ref="formContainerRef"
  >
    <Form
      v-slot="$form"
      :initial-values="formValues"
      :resolver="validationResolver"
      @submit="onValidSubmit"
      class="full"
    >
      <!-- Steps Header -->
      <StepsHeader
        v-if="schema.steps?.length"
        :steps="schema.steps"
        :active-step="activeStep"
        @step-change="handleStepChange"
      />

      <!-- Grid Container -->
      <div
        :class="['grid', `grid-cols-12`]"
        :style="{ gap: `${mergedLayout.gap}px` }"
      >
        <!-- Render Fields Based on Schema Type -->
        <template v-if="schema.sections && !schema.steps">
          <SectionsRenderer
            :sections="schema.sections"
            :columns="schema.columns"
            :form="$form"
            :disabled="disabled"
            :options-cache-t-t-l="optionsCacheTTL"
            :global-layout="mergedLayout"
            :global-style="mergedStyle"
            :column-by-field="columnByField"
            :col-style="colStyle"
          />
        </template>

        <template v-else-if="schema.steps && schema.steps.length">
          <StepsRenderer
            :current-step="schema.steps[activeStep]"
            :columns="schema.columns"
            :form="$form"
            :disabled="disabled"
            :options-cache-t-t-l="optionsCacheTTL"
            :global-layout="mergedLayout"
            :global-style="mergedStyle"
            :column-by-field="columnByField"
            :col-style="colStyle"
          />

          <!-- Step Navigation -->
          <StepNavigation
            :active-step="activeStep"
            :total-steps="schema.steps.length"
            :form="$form"
            @next="form => nextStep(form)"
            @prev="prevStep"
          />
        </template>

        <template v-else>
          <DefaultRenderer
            :columns="schema.columns"
            :form="$form"
            :disabled="disabled"
            :options-cache-t-t-l="optionsCacheTTL"
            :global-layout="mergedLayout"
            :global-style="mergedStyle"
            :col-style="colStyle"
          />
        </template>
      </div>

      <!-- Actions - 现在由用户自定义，不再预设按钮组 -->

      <!-- Persistence (Implicit) -->
      <div class="hidden">{{ persistValues($form.values) }}</div>
      <!-- ModelValue Sync (Implicit) -->
      <div class="hidden">{{ syncToModelValue($form.values) }}</div>
      <!-- Capture $form API for expose -->
      <div class="hidden">{{ captureFormApi($form) }}</div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useSizeStore } from '@/stores'
import { Form } from '@primevue/forms'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  DefaultRenderer,
  SectionsRenderer,
  StepNavigation,
  StepsHeader,
  StepsRenderer,
} from './components'
import { colStyle as helperColStyle } from './utils/helper'
import type {
  LayoutConfig,
  PersistConfig,
  SchemaColumnsItem,
  SchemaFormEmits,
  SchemaFormProps,
  StyleConfig,
} from './utils/types'
const sizeStore = useSizeStore()
const formContainerRef = ref<HTMLElement | null>(null)
let formApiRef: any = null

// ==================== Props & Emits ====================

const props = withDefaults(defineProps<SchemaFormProps>(), {
  optionsCacheTTL: 1000 * 60 * 5, // 5 minutes
  disabled: false,
})

const emit = defineEmits<SchemaFormEmits>()
/** 捕获 $form API 以便在 defineExpose 暴露 */
function captureFormApi(api: any) {
  formApiRef = api
  return ''
}

// ==================== Internal State ====================

const activeStep = ref(0)

// ==================== Form Values ====================
const formValues = computed(() => buildInitialValues())

// ==================== ModelValue Watcher ====================

/** 监听外部 modelValue 变化，更新内部表单值 */
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    // 避免初始化时的循环更新
    if (
      newValue &&
      oldValue !== undefined &&
      JSON.stringify(newValue) !== JSON.stringify(oldValue)
    ) {
      // 当外部 modelValue 变化时，重新计算初始值
      // formValues 是 computed，会自动更新
    }
  },
  { deep: true }
)

/** 监听表单值变化，同步到 modelValue */
let lastValues: Record<string, any> = {}
function syncToModelValue(values: Record<string, any>) {
  // 只有当值真正改变时才触发事件
  if (JSON.stringify(values) !== JSON.stringify(lastValues)) {
    lastValues = { ...values }
    emit('updateModelValue', { ...values })
  }
}
const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

// ==================== Computed ====================

/** 合并布局配置：props.layout > schema.layout > 默认值 */
const mergedLayout = computed((): LayoutConfig => {
  const layout = props.schema.layout || {}
  if (!layout?.cols) {
    layout.cols = 0
  }
  if (!layout?.labelWidth) {
    layout.labelWidth = '100px'
  }
  if (!layout?.labelPosition) {
    layout.labelPosition = 'right'
  }
  if (!layout?.labelAlign) {
    layout.labelAlign = 'left'
  }
  if (layout?.showLabel === undefined) {
    layout.showLabel = true
  }
  if (!layout?.gap) {
    layout.gap = sizeStore.getGap
  }
  return layout
})

/** 合并样式配置：schema.style > 默认值 */
const mergedStyle = computed((): StyleConfig => {
  return props.schema.style || {}
})

// ==================== Methods ====================

/** 构建初始值 */
function buildInitialValues(): Record<string, any> {
  const values: Record<string, any> = {}

  // 设置默认值
  for (const column of props.schema.columns) {
    if (column.defaultValue !== undefined) {
      values[column.field] = column.defaultValue
    }
  }

  // 覆盖持久化数据
  if (props.persist && typeof props.persist === 'object') {
    const persisted = loadPersistedValues(props.persist)
    Object.assign(values, persisted)
  }

  // 覆盖 modelValue
  if (props.modelValue) {
    Object.assign(values, props.modelValue)
  }

  return values
}

/** 加载持久化数据 */
function loadPersistedValues(persistConfig: PersistConfig): Record<string, any> {
  try {
    const key = `schemaform:${persistConfig.key}`
    const raw = localStorage.getItem(key)
    if (!raw) {
      return {}
    }

    const item = JSON.parse(raw)
    if (!item.expires || item.expires > Date.now()) {
      return item.values || {}
    }
  } catch {
    // 忽略 localStorage 错误
  }
  return {}
}

/** 快速查找字段 */
function columnByField(field: string): SchemaColumnsItem | undefined {
  return props.schema.columns.find(column => column.field === field)
}

/** 列样式计算 */
const colStyle = computed(() => {
  return (fieldLayout?: LayoutConfig): Record<string, string> => {
    let width = containerWidth.value || formContainerRef.value?.clientWidth || 0

    // 确保 width 是有效数字
    if (isNaN(width) || !isFinite(width) || width < 0) {
      width = 1200 // 默认桌面宽度
    }

    // 合并布局配置：fieldLayout > mergedLayout > 默认值
    const finalLayout: LayoutConfig = {
      ...mergedLayout.value,
      ...fieldLayout, // 表单项配置优先级最高
    }

    // 直接使用 helperColStyle，它会正确处理表单项的 cols 配置
    return helperColStyle(finalLayout, width)
  }
})

/** 监听容器尺寸变化 */
function setupResizeObserver() {
  if (!formContainerRef.value) {
    return
  }

  // 清理之前的 observer
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      containerWidth.value = entry.contentRect.width
    }
  })

  resizeObserver.observe(formContainerRef.value)
}

/** 更新容器宽度（备用方案） */
function updateContainerWidth() {
  if (formContainerRef.value) {
    containerWidth.value = formContainerRef.value.clientWidth
  }
}

// ==================== Lifecycle ====================

onMounted(() => {
  // 延迟设置，确保 DOM 已经渲染
  nextTick(() => {
    setupResizeObserver()
    // 初始设置容器宽度
    updateContainerWidth()
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  // 移除窗口大小变化监听
  window.removeEventListener('resize', updateContainerWidth)
})

// 添加窗口大小变化监听作为备用方案
onMounted(() => {
  window.addEventListener('resize', updateContainerWidth)
})

/** 构建验证解析器（PrimeVue 期望的错误格式：{ field: [{ message }] }） */
function buildValidationResolver() {
  return (incoming: any) => {
    // PrimeVue 会传入形如 { names: [...], values: {...} } 的对象，这里做兼容
    const values: Record<string, any> =
      incoming && typeof incoming === 'object' && 'values' in incoming ? incoming.values : incoming
    const errors: Record<string, Array<{ message: string }>> = {}

    for (const column of props.schema.columns) {
      if (!column.rules) {
        continue
      }

      const value = values[column.field]
      const fieldError = validateField(column, value, values)

      if (fieldError) {
        errors[column.field] = [{ message: fieldError }]
      }
    }

    return { values, errors }
  }
}

/** 验证单个字段 */
function validateField(
  column: SchemaColumnsItem,
  value: any,
  allValues: Record<string, any>
): string | null {
  const ctx = { values: allValues, column }

  if (typeof column.rules === 'string') {
    return validateStringRules(column.rules, value)
  } else if (typeof column.rules === 'function') {
    return validateFunctionRule(column.rules, value, ctx)
  } else if (column.rules && typeof column.rules === 'object' && 'validate' in column.rules) {
    return validateYupSchema(column.rules, value)
  }

  return null
}

/** 验证字符串规则 */
function validateStringRules(rules: string, value: any): string | null {
  const ruleList = rules.split('|')

  for (const rule of ruleList) {
    if (!rule) {
      continue
    }

    // required：仅在字符串为空串/空白、null/undefined 时判定为空；
    // 对于对象/数组/数字/布尔（包括 false）不当作“空”。
    if (
      rule === 'required' &&
      (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))
    ) {
      return '必填项'
    } else if (rule.startsWith('min:')) {
      const min = parseInt(rule.split(':')[1])
      if (typeof value === 'string' && value.length < min) {
        return `至少 ${min} 个字符`
      } else if (typeof value === 'number' && value < min) {
        return `最小值为 ${min}`
      }
    } else if (rule.startsWith('max:')) {
      const max = parseInt(rule.split(':')[1])
      if (typeof value === 'string' && value.length > max) {
        return `最多 ${max} 个字符`
      } else if (typeof value === 'number' && value > max) {
        return `最大值为 ${max}`
      }
    } else if (rule === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return '邮箱格式不正确'
      }
    } else if (rule === 'integer' && value) {
      if (!Number.isInteger(Number(value))) {
        return '必须为整数'
      }
    }
  }

  return null
}

/** 验证函数规则 */
function validateFunctionRule(
  rule: (value: any, ctx: any) => true | string | Promise<true | string>,
  value: any,
  ctx: any
): string | null {
  try {
    const result = rule(value, ctx)
    if (result instanceof Promise) {
      // 对于异步函数，暂时返回 null，实际验证会在异步流程中处理
      return null
    }
    return result === true ? null : typeof result === 'string' ? result : '校验失败'
  } catch {
    return '校验失败'
  }
}

/** 验证 Yup Schema */
function validateYupSchema(schema: any, value: any): string | null {
  try {
    schema.validateSync(value)
    return null
  } catch (error: any) {
    return error.message
  }
}

// 使用稳定的函数引用，避免 computed 包裹导致的解包问题
const validationResolver = buildValidationResolver()

/** 持久化数据（节流） */
let persistTimer: NodeJS.Timeout | null = null
function persistValues(values: Record<string, any>): string {
  if (!props.persist || typeof props.persist !== 'object') {
    return ''
  }

  clearTimeout(persistTimer!)
  persistTimer = setTimeout(() => {
    try {
      const persistConfig = props.persist as PersistConfig
      const ttl = persistConfig.ttl ?? 24 * 60 * 60 * 1000
      const key = `schemaform:${persistConfig.key}`
      localStorage.setItem(
        key,
        JSON.stringify({
          values,
          expires: Date.now() + ttl,
        })
      )
    } catch {
      // 忽略 localStorage 错误
    }
  }, 300)

  return ''
}

/** 提交成功处理 */
async function onValidSubmit(event: { values: Record<string, any>; valid: boolean; errors: any }) {
  const { values, valid, errors } = event

  if (!valid) {
    const errorMap: Record<string, string> = {}
    for (const [fieldName, fieldErrors] of Object.entries(
      errors as Record<string, Array<{ message?: string }>>
    )) {
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        errorMap[fieldName] = fieldErrors[0]?.message || '验证失败'
      }
    }
    emit('error', { errors: errorMap })
    return
  }

  // 字段输出转换
  const transformedValues: Record<string, any> = {}
  for (const column of props.schema.columns) {
    const rawValue = values[column.field]
    transformedValues[column.field] = column.transform?.output
      ? column.transform.output(rawValue, { values, column })
      : rawValue
  }

  // 全局提交转换
  const finalValues = props.submitTransform
    ? props.submitTransform(transformedValues)
    : transformedValues

  emit('submit', finalValues)
}

/** 步骤切换处理 */
function handleStepChange(stepIndex: number) {
  activeStep.value = stepIndex
}

/** 下一步处理 */
async function nextStep(form: any) {
  if (!props.schema.steps) {
    return
  }

  const currentStepFields = props.schema.steps[activeStep.value].fields
  const hasError = await validateStepFields(currentStepFields, form.values)

  if (!hasError) {
    activeStep.value = Math.min(activeStep.value + 1, props.schema.steps.length - 1)
  }
}

/** 上一步处理 */
function prevStep() {
  activeStep.value = Math.max(activeStep.value - 1, 0)
}

/** 验证步骤字段 */
async function validateStepFields(
  fieldNames: string[],
  values: Record<string, any>
): Promise<boolean> {
  for (const fieldName of fieldNames) {
    const column = columnByField(fieldName)
    if (column?.rules) {
      const value = values[fieldName]
      const error = validateField(column, value, values)
      if (error) {
        return true
      } // 有错误
    }
  }
  return false // 无错误
}

// 这些方法现在由用户通过 hook 调用，不再需要内部处理

// =============== Expose API ===============
defineExpose({
  /** 获取当前值 */
  get values() {
    if (formApiRef) {
      // PrimeVue Form 的 $form 对象直接包含字段值
      // 过滤掉函数和方法，只保留字段值
      const fieldValues: Record<string, any> = {}
      Object.keys(formApiRef).forEach(key => {
        // 跳过函数和方法
        if (typeof formApiRef[key] !== 'function' && key !== 'valid' && key !== 'errors') {
          // 检查是否是响应式对象（Proxy）
          if (
            formApiRef[key] &&
            typeof formApiRef[key] === 'object' &&
            'value' in formApiRef[key]
          ) {
            const value = formApiRef[key].value

            // 特殊处理 InputOtp 组件
            if (key === 'inputOtp') {
              // 尝试直接访问 InputOtp 组件的实例
              const inputOtpElement = formContainerRef.value?.querySelector(
                '[name="inputOtp"]'
              ) as any
              if (inputOtpElement && inputOtpElement.__vueParentComponent) {
                const inputOtpInstance = inputOtpElement.__vueParentComponent.ctx

                if (
                  inputOtpInstance &&
                  inputOtpInstance.tokens &&
                  Array.isArray(inputOtpInstance.tokens)
                ) {
                  const tokens = inputOtpInstance.tokens
                  const fullValue = tokens.join('')
                  fieldValues[key] = fullValue
                } else {
                  fieldValues[key] = value
                }
              } else {
                fieldValues[key] = value
              }
            } else {
              fieldValues[key] = value
            }
          } else {
            fieldValues[key] = formApiRef[key]
          }
        }
      })
      return fieldValues
    }
    return {}
  },
  /** 触发验证，返回 { valid, errors } */
  async validate() {
    if (formApiRef && typeof formApiRef.validate === 'function') {
      const result = await formApiRef.validate()
      return result
    }
    return { valid: true, errors: {} }
  },
  /** 提交（走内部 onValidSubmit 流程） */
  submit() {
    const formEl = formContainerRef.value?.querySelector('form') as HTMLFormElement | null
    if (formEl) {
      formEl.requestSubmit()
    }
  },
  /** 重置（恢复 defaultValue） */
  reset() {
    if (formApiRef && typeof formApiRef.reset === 'function') {
      return formApiRef.reset()
    }
    // 兜底：刷新 initial-values 依赖
    const el = formContainerRef.value?.querySelector('form') as any
    if (el && typeof el.reset === 'function') {
      el.reset()
    }
  },
  /** 设置某个字段值 */
  setFieldValue(field: string, value: any) {
    if (formApiRef && typeof formApiRef.setFieldValue === 'function') {
      return formApiRef.setFieldValue(field, value)
    }
  },
  /** 批量设置值 */
  setValues(newValues: Record<string, any>) {
    if (formApiRef && typeof formApiRef.setValues === 'function') {
      return formApiRef.setValues(newValues)
    }
    // 兜底：逐个字段设置
    if (formApiRef && typeof formApiRef.setFieldValue === 'function') {
      Object.keys(newValues || {}).forEach(key => {
        formApiRef.setFieldValue(key, (newValues as any)[key])
      })
    }
  },
})
</script>

<style scoped>
/* 样式已通过 UnoCSS 类处理 */
</style>
