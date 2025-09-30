// @/components/schema-form/components/FormItems.tsx
import { AnimateWrapper } from '@/components/modules/animate-wrapper'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { evalBoolish, isFieldRequired, loadOptions } from '../utils/helper'
import type {
  EvalCtx,
  LayoutConfig,
  OptionItem,
  SchemaColumnsItem,
  StyleConfig,
} from '../utils/types'

// PrimeVue Components
import AutoComplete from 'primevue/autocomplete'
import CascadeSelect from 'primevue/cascadeselect'
import Checkbox from 'primevue/checkbox'
import ColorPicker from 'primevue/colorpicker'
import DatePicker from 'primevue/datepicker'
import Editor from 'primevue/editor'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputMask from 'primevue/inputmask'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Listbox from 'primevue/listbox'
import MultiSelect from 'primevue/multiselect'
import Password from 'primevue/password'
import ProgressSpinner from 'primevue/progressspinner'
import RadioButton from 'primevue/radiobutton'
import RadioButtonGroup from 'primevue/radiobuttongroup'
import Rating from 'primevue/rating'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Slider from 'primevue/slider'
import Textarea from 'primevue/textarea'
import ToggleButton from 'primevue/togglebutton'
import ToggleSwitch from 'primevue/toggleswitch'
import TreeSelect from 'primevue/treeselect'

// ==================== Props Interface ====================

interface SchemaFormItemProps {
  column: SchemaColumnsItem
  form: any
  disabled: boolean
  optionsCacheTTL: number
  globalLayout: LayoutConfig
  globalStyle?: StyleConfig
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
    globalStyle: { type: Object as () => StyleConfig, default: () => ({}) },
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

    /** 合并样式配置：column.style > globalStyle > 默认值 */
    const mergedColumnStyle = computed((): StyleConfig => {
      const columnStyle = props.column.style || {}
      const globalStyle = props.globalStyle || {}
      const style = {
        ...globalStyle,
        ...columnStyle, // 表单项配置优先级最高
      }
      return style
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
      let width = '100%'

      if (labelAlign.value !== 'top') {
        if (typeof labelWidth.value === 'number') {
          // 确保数字是有效的
          if (isNaN(labelWidth.value) || !isFinite(labelWidth.value)) {
            width = '100px'
          } else {
            width = `${labelWidth.value}px`
          }
        } else if (typeof labelWidth.value === 'string') {
          width = labelWidth.value
        }
      }

      return { width }
    })

    const componentStyle = computed(() => {
      let labelWidthNum = 0

      if (typeof labelWidth.value === 'number') {
        labelWidthNum = labelWidth.value
      } else if (labelWidth.value === 'auto') {
        labelWidthNum = 0
      } else if (typeof labelWidth.value === 'string') {
        // 安全地解析字符串中的数字
        const match = labelWidth.value.match(/(\d+(?:\.\d+)?)/)
        labelWidthNum = match ? parseFloat(match[1]) : 0
      }

      // 确保 labelWidthNum 是有效数字
      if (isNaN(labelWidthNum) || !isFinite(labelWidthNum)) {
        labelWidthNum = 0
      }

      // 现在使用独立的间距元素，所以不需要在宽度计算中减去 gap
      return {
        width: labelAlign.value === 'top' ? '100%' : `calc(100% - ${labelWidthNum}px)`,
      }
    })

    // ==================== Methods ====================
    async function evalAll() {
      visible.value = await evalBoolish(props.column.visible ?? true, ctx.value)
      fieldDisabled.value =
        props.disabled || (await evalBoolish(props.column.disabled ?? false, ctx.value))
      readonly.value = await evalBoolish(props.column.readonly ?? false, ctx.value)

      if (props.column.props?.options) {
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
    onMounted(() => {
      evalAll()
    })

    // 监听 dependsOn 触发刷新
    watch(
      () => (props.column.dependsOn || []).map((key: string) => (props.form.values || {})[key]),
      () => {
        evalAll()
      },
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
        class: ['form-item-content', isInvalid ? 'form-item-content-invalid' : ''].filter(Boolean),
        style: {
          ...componentStyle.value,
        },
        disabled: fieldDisabled.value,
        readonly: readonly.value,
        placeholder: column.placeholder,
      }

      // 安全地过滤 props，排除可能导致问题的属性
      const safeProps = column.props
        ? Object.fromEntries(
            Object.entries(column.props).filter(([key]) => {
              // 排除以 'on' 开头的属性，避免被当作事件处理器
              if (key.startsWith('on')) {
                return false
              }
              // 排除会破坏 Form 受控绑定的值相关属性
              if (
                key === 'value' ||
                key === 'modelValue' ||
                key === 'model-value' ||
                key === 'checked'
              ) {
                return false
              }
              return true
            })
          )
        : {}

      // 使用 PrimeVue Form 的 name 属性绑定
      const componentProps = {
        ...baseProps,
        ...safeProps,
        name: column.field, // PrimeVue Form 使用 name 属性绑定字段
        class: [
          ...baseProps.class,
          mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
        ].filter(Boolean),
        style: {
          ...baseProps.style,
          ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
        },
      }

      // 选项属性 - 只从 props 中获取
      const optionsProps = column.props?.options || options.value

      switch (column.component) {
        case 'AutoComplete':
          return (
            <AutoComplete
              {...componentProps}
              suggestions={optionsProps.map((item: any) => item.label)}
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            />
          )

        case 'CascadeSelect':
          return (
            <CascadeSelect
              {...componentProps}
              options={optionsProps}
              optionGroupLabel="label"
              optionGroupChildren="children"
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
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

        case 'InputGroup': {
          // InputGroup 需要特殊处理，因为它需要包含 InputGroupAddon 和实际的输入组件
          const { addonBefore, addonAfter, ...otherProps } = column.props || {}
          return (
            <InputGroup
              {...otherProps}
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            >
              {addonBefore && <InputGroupAddon>{addonBefore}</InputGroupAddon>}
              <InputText
                {...baseProps}
                name={column.field}
                placeholder={column.placeholder}
              />
              {addonAfter && <InputGroupAddon>{addonAfter}</InputGroupAddon>}
            </InputGroup>
          )
        }

        case 'InputMask':
          return <InputMask {...componentProps} />

        case 'InputNumber':
          return <InputNumber {...componentProps} />

        case 'InputText':
          return <InputText {...componentProps} />

        /* case 'KeyFilter':
          return <KeyFilter {...componentProps} /> */

        case 'Listbox':
          return (
            <Listbox
              {...componentProps}
              options={optionsProps}
              optionLabel="label"
              optionValue="value"
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            />
          )

        case 'MultiSelect':
          return (
            <MultiSelect
              {...componentProps}
              options={optionsProps}
              optionLabel="label"
              optionValue="value"
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            />
          )

        case 'Password':
          return <Password {...componentProps} />

        case 'RadioButton': {
          // RadioButton 需要特殊处理，使用 RadioButtonGroup 包装多个选项
          return (
            <RadioButtonGroup
              name={column.field}
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            >
              {optionsProps.map((option: any, index: number) => (
                <div
                  key={option.value}
                  class="flex items-center gap-2"
                >
                  <RadioButton
                    inputId={`${column.field}_${index}`}
                    value={option.value}
                    disabled={fieldDisabled.value}
                  />
                  <label for={`${column.field}_${index}`}>{option.label}</label>
                </div>
              ))}
            </RadioButtonGroup>
          )
        }

        case 'Rating':
          return <Rating {...componentProps} />

        case 'Select':
          return (
            <Select
              {...componentProps}
              options={optionsProps}
              optionLabel="label"
              optionValue="value"
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            />
          )

        case 'SelectButton':
          return (
            <SelectButton
              {...componentProps}
              options={optionsProps}
              optionLabel="label"
              optionValue="value"
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            />
          )

        case 'Slider':
          return <Slider {...componentProps} />

        case 'Textarea':
          return <Textarea {...componentProps} />

        case 'ToggleButton': {
          // 为 ToggleButton 单独处理属性，避免 onLabel 等被当作事件处理器
          const toggleButtonProps: any = {
            class: [
              ...baseProps.class,
              mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
            ].filter(Boolean),
            style: {
              ...baseProps.style,
              ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
            },
            disabled: baseProps.disabled,
            readonly: baseProps.readonly,
            placeholder: baseProps.placeholder,
            name: column.field,
          }
          // 明确绑定这些属性，避免被当作事件处理器
          if (column.props?.onLabel) {
            toggleButtonProps.onLabel = column.props.onLabel
          }
          if (column.props?.offLabel) {
            toggleButtonProps.offLabel = column.props.offLabel
          }
          if (column.props?.onIcon) {
            toggleButtonProps.onIcon = column.props.onIcon
          }
          if (column.props?.offIcon) {
            toggleButtonProps.offIcon = column.props.offIcon
          }
          if (column.props?.ariaLabelledBy) {
            toggleButtonProps.ariaLabelledBy = column.props.ariaLabelledBy
          }
          return <ToggleButton {...toggleButtonProps} />
        }

        case 'ToggleSwitch':
          return <ToggleSwitch {...componentProps} />

        case 'TreeSelect': {
          // TreeSelect 需要 TreeNode 格式的数据，需要转换
          const treeNodes = optionsProps.map((item: any) => ({
            key: item.value,
            label: item.label,
            data: item.value,
            children:
              item.children?.map((child: any) => ({
                key: child.value,
                label: child.label,
                data: child.value,
                children:
                  child.children?.map((grandChild: any) => ({
                    key: grandChild.value,
                    label: grandChild.label,
                    data: grandChild.value,
                  })) || [],
              })) || [],
          }))

          return (
            <TreeSelect
              {...componentProps}
              modelValue={props.form.values?.[column.field]}
              options={treeNodes}
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            />
          )
        }

        /* 自定义渲染 */
        case 'Custom':
          return (
            <div
              class={[
                ...baseProps.class,
                mergedColumnStyle.value.contentClass || '', // 自定义内容类名（第一优先级）
              ].filter(Boolean)}
              style={{
                ...baseProps.style,
                ...(mergedColumnStyle.value.contentStyle || {}), // 自定义内容样式（第一优先级）
              }}
            >
              {column.props?.render(componentProps)}
            </div>
          )

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
      // 是否隐藏
      const isHidden = column.hidden === true
      // 是否保留隐藏字段的值（默认 false）
      const keepHiddenValue = column.hideValue === true
      // 是否保留所占栅格（默认 false）
      const keepBlock = column.hideBlock === true

      // 包裹元素样式（控制是否保留栅格/整体隐藏）
      const itemStyle: Record<string, string> = {
        ...props.style,
        marginBottom: '24px',
      }

      // 内容容器样式（控制内部可视/渲染）
      const contentStyle: Record<string, string> = {
        ...componentStyle.value,
      }

      // 是否需要隐藏 Label（当保留栅格但不保留值时，Label 也应隐藏）
      let hideLabel = false

      if (isHidden) {
        if (keepBlock) {
          // 保留栅格：外层不改变 grid 占位
          if (keepHiddenValue) {
            // 可获取值：渲染但不可见
            itemStyle.visibility = 'hidden'
            hideLabel = true
          } else {
            // 不可获取值：内容不显示（仍渲染外壳以占位）
            contentStyle.display = 'none'
            hideLabel = true
          }
        } else {
          // 不保留栅格
          if (keepHiddenValue) {
            // 可获取值：整体隐藏但仍渲染
            itemStyle.display = 'none'
            hideLabel = true
          } else {
            // 不可获取值：完全不渲染
            return null
          }
        }
      }

      return (
        <div
          class={[
            'form-item',
            labelAlign.value === 'top'
              ? 'between-col'
              : labelAlign.value === 'right'
                ? 'between-start flex-row-reverse'
                : 'between-start', // 改为 between-start 而不是 between
          ].filter(Boolean)}
          style={itemStyle}
          data-field-id={column.field}
        >
          {/* Label */}
          {showLabel.value && column.label && (
            <div
              style={{
                ...labelStyle.value,
                ...(mergedColumnStyle.value.labelStyle || {}), // 自定义标签样式（第一优先级）
                ...(hideLabel ? { display: 'none' } : {}),
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
                mergedColumnStyle.value.labelClass || '', // 自定义标签类名（第一优先级）
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
          {/* 间距元素 - 只在非顶部对齐时显示 */}

          <div
            class={['relative w-full ha'].filter(Boolean)}
            style={contentStyle}
          >
            {/* Component Container */}
            {renderComponent()}
            {/* Loading Spinner */}
            {loading.value && (
              <ProgressSpinner class="w-appFontSizex h-appFontSizex absolute right-2 top-1/2 -translate-y-1/2" />
            )}
            {/* Help Text */}
            {!isInvalid && column.help && (
              <div
                class={[
                  'absolute top-[calc(100%+2px)] left-0 z-1 color-bg300 select-none pl-paddings pointer-events-none',
                  'fs-10 sm:fs-12 md:fs-14 lg:fs-12',
                ]}
              >
                {column.help}
              </div>
            )}
            {/* Validation Error */}
            <AnimateWrapper
              class="absolute top-[calc(100%+2px)] min-w-full z-1 color-dangerColor between-start! select-none pointer-events-none"
              show={isInvalid}
              enter="fadeIn"
              leave="fadeOut"
              duration="500ms"
            >
              {isInvalid && (
                <div
                  class={['full rounded-rounded pl-paddings', 'fs-10 sm:fs-12 md:fs-14 lg:fs-12']}
                >
                  {props.form[column.field]?.error?.message}
                </div>
              )}
            </AnimateWrapper>
          </div>
        </div>
      )
    }
  },
})
