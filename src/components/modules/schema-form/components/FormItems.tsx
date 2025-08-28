// @/components/schema-form/components/FormItems.tsx
import { AnimateWrapper } from '@/components/modules/animate-wrapper'
import { useSizeStore } from '@/stores'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { evalBoolish, isFieldRequired, loadOptions } from '../utils/helper'
import type { EvalCtx, LayoutConfig, OptionItem, SchemaColumnsItem } from '../utils/types'

// PrimeVue Components
import AutoComplete from 'primevue/autocomplete'
import CascadeSelect from 'primevue/cascadeselect'
import Checkbox from 'primevue/checkbox'
import ColorPicker from 'primevue/colorpicker'
import DatePicker from 'primevue/datepicker'
import Editor from 'primevue/editor'
import InputGroup from 'primevue/inputgroup'
import InputMask from 'primevue/inputmask'
import InputNumber from 'primevue/inputnumber'
import InputOtp from 'primevue/inputotp'
import InputText from 'primevue/inputtext'
// import KeyFilter from 'primevue/keyfilter'
import Knob from 'primevue/knob'
import Listbox from 'primevue/listbox'
import MultiSelect from 'primevue/multiselect'
import Password from 'primevue/password'
import ProgressSpinner from 'primevue/progressspinner'
import RadioButton from 'primevue/radiobutton'
import Rating from 'primevue/rating'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Slider from 'primevue/slider'
import Textarea from 'primevue/textarea'
import ToggleButton from 'primevue/togglebutton'
import ToggleSwitch from 'primevue/toggleswitch'
import TreeSelect from 'primevue/treeselect'

const sizeStore = useSizeStore()
const gap = computed(() => sizeStore.getGap)
// ==================== Props Interface ====================

interface SchemaFormItemProps {
  column: SchemaColumnsItem
  form: any
  disabled: boolean
  optionsCacheTTL: number
  globalLayout: LayoutConfig
  style?: Record<string, string>
}

// ==================== Component Definition ====================

export default defineComponent({
  name: 'SchemaFormItem',
  props: {
    column: { type: Object as () => SchemaColumnsItem, required: true },
    form: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    optionsCacheTTL: { type: Number, default: 1000 * 60 * 5 },
    globalLayout: { type: Object as () => LayoutConfig, default: () => ({}) },
    style: { type: Object as () => Record<string, string>, default: () => ({}) },
  },
  setup(props: SchemaFormItemProps) {
    // ==================== Reactive State ====================
    const visible = ref(true)
    const fieldDisabled = ref(!!props.disabled)
    const readonly = ref(false)
    const options = ref<OptionItem[]>([])
    const loading = ref(false)

    // ==================== Computed ====================
    const ctx = computed(
      (): EvalCtx => ({
        values: props.form.values || {},
        column: props.column,
      })
    )

    /** 合并布局配置：column.layout > globalLayout > 默认值 */
    const mergedColumnLayout = computed((): LayoutConfig => {
      const columnLayout = props.column.layout || {}
      const globalLayout = props.globalLayout || {}
      const layout = {
        ...globalLayout,
        ...columnLayout, // 表单项配置优先级最高
      }
      return layout
    })

    const showLabel = computed(() => mergedColumnLayout.value.showLabel)
    const labelAlign = computed(() => mergedColumnLayout.value.labelAlign)
    const labelPosition = computed(() => mergedColumnLayout.value.labelPosition)
    const labelWidth = computed(() => {
      const width = mergedColumnLayout.value.labelWidth
      if (width === 'auto') {
        return '100%'
      }
      return width
    })

    const labelStyle = computed(() => {
      return {
        width:
          labelAlign.value === 'top'
            ? '100%'
            : typeof labelWidth.value === 'number'
              ? `${labelWidth.value}px`
              : labelWidth.value,
      }
    })

    const componentStyle = computed(() => {
      const labelWidthNum =
        typeof labelWidth.value === 'number'
          ? labelWidth.value
          : labelWidth.value === 'auto'
            ? 0
            : Number(parseInt(labelWidth.value?.replace('px', '') ?? '0'))

      return {
        width:
          labelAlign.value === 'top' ? '100%' : `calc(100% - ${labelWidthNum}px - ${gap.value}px)`,
      }
    })

    // ==================== Methods ====================
    async function evalAll() {
      visible.value = await evalBoolish(props.column.visible ?? true, ctx.value)
      fieldDisabled.value =
        props.disabled || (await evalBoolish(props.column.disabled ?? false, ctx.value))
      readonly.value = await evalBoolish(props.column.readonly ?? false, ctx.value)

      if (props.column.options) {
        loading.value = true
        try {
          const data = await loadOptions(props.column, ctx.value, props.optionsCacheTTL)
          options.value = data
        } finally {
          loading.value = false
        }
      }
    }

    // ==================== Lifecycle & Watchers ====================
    onMounted(evalAll)

    // 监听 dependsOn 触发刷新
    watch(
      () => (props.column.dependsOn || []).map((key: string) => (props.form.values || {})[key]),
      evalAll,
      {
        deep: false,
      }
    )

    // ==================== Render Component ====================
    function renderComponent() {
      const column = props.column
      // 是否校验失败
      const isInvalid = props.form[column.field]?.invalid

      // 基础属性
      const baseProps = {
        class: [
          'form-item-content',
          isInvalid ? 'form-item-content-invalid' : '',
          column.contentClass || '', // 自定义内容类名（第一优先级）
        ].filter(Boolean),
        style: column.contentStyle || {}, // 自定义内容样式（第一优先级）
        disabled: fieldDisabled.value,
        readonly: readonly.value,
        placeholder: column.placeholder,
        ...column.props,
      }

      // 使用 PrimeVue Form 的 name 属性绑定
      const componentProps = {
        ...baseProps,
        name: column.field, // PrimeVue Form 使用 name 属性绑定字段
      }

      // 选项属性
      const optionsProps = Array.isArray(column.options) ? column.options : options.value

      switch (column.component) {
        case 'AutoComplete':
          return <AutoComplete {...componentProps} />

        case 'CascadeSelect':
          return (
            <CascadeSelect
              {...componentProps}
              options={optionsProps}
            />
          )

        case 'Checkbox':
          return <Checkbox {...componentProps} />

        case 'ColorPicker':
          return <ColorPicker {...componentProps} />

        case 'DatePicker':
          return <DatePicker {...componentProps} />

        case 'Editor':
          return <Editor {...componentProps} />

        case 'InputGroup':
          return <InputGroup {...componentProps} />

        case 'InputMask':
          return <InputMask {...componentProps} />

        case 'InputNumber':
          return <InputNumber {...componentProps} />

        case 'InputOtp':
          return <InputOtp {...componentProps} />

        case 'InputText':
          return <InputText {...componentProps} />

        /* case 'KeyFilter':
          return <KeyFilter {...componentProps} /> */

        case 'Knob':
          return <Knob {...componentProps} />

        case 'Listbox':
          return (
            <Listbox
              {...componentProps}
              options={optionsProps}
            />
          )

        case 'MultiSelect':
          return (
            <MultiSelect
              {...componentProps}
              options={optionsProps}
            />
          )

        case 'Password':
          return <Password {...componentProps} />

        case 'RadioButton':
          return <RadioButton {...componentProps} />

        case 'Rating':
          return <Rating {...componentProps} />

        case 'Select':
          return (
            <Select
              {...componentProps}
              options={optionsProps}
            />
          )

        case 'SelectButton':
          return (
            <SelectButton
              {...componentProps}
              options={optionsProps}
            />
          )

        case 'Slider':
          return <Slider {...componentProps} />

        case 'Textarea':
          return <Textarea {...componentProps} />

        case 'ToggleButton':
          return <ToggleButton {...componentProps} />

        case 'ToggleSwitch':
          return <ToggleSwitch {...componentProps} />

        case 'TreeSelect':
          return <TreeSelect {...componentProps} />

        default:
          return <div>不支持的组件类型: {column.component}</div>
      }
    }

    // ==================== Render ====================
    return () => {
      if (!visible.value) {
        return null
      }

      const column = props.column
      // 是否校验失败
      const isInvalid = props.form[column.field]?.invalid
      // 是否必填
      const isRequired = isFieldRequired(column)

      return (
        <div
          class={[
            'full form-item',
            labelAlign.value === 'top'
              ? 'between-col'
              : labelAlign.value === 'right'
                ? 'between-start flex-row-reverse'
                : 'between',
            column.contentClass || '', // 自定义内容类名（第一优先级）
          ].filter(Boolean)}
          style={{
            ...props.style,
            ...(column.contentStyle || {}), // 自定义内容样式（第一优先级）
          }}
          data-field-id={column.field}
        >
          {/* Label */}
          {showLabel.value && column.label && (
            <div
              style={{
                ...labelStyle.value,
                ...(column.labelStyle || {}), // 自定义标签样式（第一优先级）
              }}
              class={[
                'form-item-label',
                'py-paddings',
                labelPosition.value === 'top' ? 'center-start' : '',
                labelPosition.value === 'bottom' ? 'center-end' : '',
                labelPosition.value === 'left' ? 'between-start' : '',
                labelPosition.value === 'right' ? 'between-end' : '',
                labelPosition.value === 'left-top' ? 'between-start items-start' : '',
                labelPosition.value === 'left-bottom' ? 'between-start items-end' : '',
                labelPosition.value === 'right-top' ? 'between-end items-start' : '',
                labelPosition.value === 'right-bottom' ? 'between-end items-end' : '',
                column.labelClass || '', // 自定义标签类名（第一优先级）
              ].filter(Boolean)}
            >
              {column.label}
              {isRequired && (
                <div
                  class={[
                    'fs-appFontSizes mb-6',
                    isInvalid ? 'color-dangerColor' : 'color-dangerActiveColor',
                  ]}
                >
                  &nbsp;*
                </div>
              )}
            </div>
          )}
          <div class="w-gap"></div>
          <div
            class={[
              'relative w-full ha c-transitions',
              column.contentClass || '', // 自定义内容类名（第一优先级）
            ].filter(Boolean)}
            style={{
              ...componentStyle.value,
              ...(column.contentStyle || {}), // 自定义内容样式（第一优先级）
            }}
          >
            {/* Component Container */}
            {renderComponent()}

            {/* Loading Spinner */}
            {loading.value && (
              <ProgressSpinner class="w-appFontSizex h-appFontSizex absolute right-2 top-1/2 -translate-y-1/2" />
            )}

            {/* Help Text */}
            {!isInvalid && column.help && (
              <div class="absolute top-[calc(100%-2px)] left-0 z-1 fs-appFontSizes color-bg300 select-none">
                {column.help}
              </div>
            )}

            {/* Validation Error */}
            <AnimateWrapper
              class="absolute top-[calc(100%-2px)]  min-w-full z-1 color-dangerColor fs-appFontSizes between-start! select-none"
              show={isInvalid}
              enter="fadeIn"
              leave="fadeOut"
              duration="500ms"
            >
              {isInvalid && (
                <div class="full rounded-rounded">{props.form[column.field]?.error?.message}</div>
              )}
            </AnimateWrapper>
          </div>
        </div>
      )
    }
  },
})
