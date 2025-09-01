<script setup lang="ts">
import type { Schema, SchemaColumnsItem } from '@/components/modules/schema-form/utils/types'
import { useSchemaForm } from '@/hooks/components/useSchemaForm'
import { ref } from 'vue'

// ==================== 表单 Schema 定义 ====================
const initialSchema: Schema = {
  columns: [
    // 基础输入组件
    {
      field: 'inputText',
      label: '文本输入',
      component: 'InputText',
      placeholder: '请输入文本',
      rules: 'required|min:3|max:20',
      help: '文本长度为3-20个字符',
      defaultValue: '默认初始文本',
      layout: {
        labelAlign: 'top',
        labelPosition: 'left',
        cols: 12,
      },
    },
    {
      field: 'inputNumber',
      label: '数字输入',
      component: 'InputNumber',
      placeholder: '请输入数字',
      rules: 'required|min:1|max:100',
      help: '数字范围为1-100',
      props: {
        min: 1,
        max: 100,
        step: 1,
      },
    },
    {
      field: 'password',
      label: '密码输入',
      component: 'Password',
      placeholder: '请输入密码',
      rules: 'required|min:6',
      help: '密码至少6位',
      props: {
        toggleMask: true,
        feedback: false,
      },
    },
    {
      field: 'textarea',
      label: '文本区域',
      component: 'Textarea',
      placeholder: '请输入详细描述',
      rules: 'required|min:10|max:500',
      help: '描述至少10个字符，最多500个字符',
      props: {
        rows: 4,
        autoResize: true,
      },
    },
    {
      field: 'inputMask',
      label: '手机号码',
      component: 'InputMask',
      placeholder: '请输入手机号',
      rules: 'required',
      help: '请输入11位手机号码',
      props: {
        mask: '99999999999',
        slotChar: '_',
      },
    },
    {
      field: 'inputOtp',
      label: '验证码',
      component: 'InputOtp',
      rules: 'required',
      help: '请输入6位验证码',
      defaultValue: '123456',
      props: {
        length: 6,
        integerOnly: true,
      },
      layout: {
        cols: 6,
      },
    },
    {
      field: 'inputGroup',
      label: '输入组',
      component: 'InputGroup',
      placeholder: '请输入邮箱',
      help: '带前缀和后缀的输入框',
      props: {
        addonBefore: '@',
        addonAfter: '.com',
      },
    },

    // 选择组件
    {
      field: 'select',
      label: '下拉选择',
      component: 'Select',
      placeholder: '请选择选项',
      rules: 'required',
      help: '请选择一个选项',
      props: {
        options: [
          { label: '选项1', value: 'option1' },
          { label: '选项2', value: 'option2' },
          { label: '选项3', value: 'option3' },
        ],
        value: null,
      },
    },
    {
      field: 'multiSelect',
      label: '多选下拉',
      component: 'MultiSelect',
      placeholder: '请选择多个选项',
      help: '可以选择多个选项',
      props: {
        options: [
          { label: '苹果', value: 'apple' },
          { label: '香蕉', value: 'banana' },
          { label: '橙子', value: 'orange' },
          { label: '葡萄', value: 'grape' },
        ],
        maxSelectedLabels: 2,
        showSelectAll: true,
        value: [],
      },
    },
    {
      field: 'listbox',
      label: '列表框',
      component: 'Listbox',
      placeholder: '请选择选项',
      rules: 'required',
      help: '从列表中选择一个选项',
      props: {
        options: [
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' },
          { label: '广州', value: 'guangzhou' },
          { label: '深圳', value: 'shenzhen' },
        ],
        multiple: false,
        filter: true,
        value: null,
      },
    },
    {
      field: 'cascadeSelect',
      label: '级联选择',
      component: 'CascadeSelect',
      placeholder: '请选择地区',
      rules: 'required',
      help: '请选择省市区',
      props: {
        options: [
          {
            label: '北京市',
            value: 'beijing',
            children: [
              {
                label: '朝阳区',
                value: 'chaoyang',
                children: [
                  { label: '三里屯', value: 'sanlitun' },
                  { label: '国贸', value: 'guomao' },
                ],
              },
              {
                label: '海淀区',
                value: 'haidian',
                children: [
                  { label: '中关村', value: 'zhongguancun' },
                  { label: '五道口', value: 'wudaokou' },
                ],
              },
            ],
          },
          {
            label: '上海市',
            value: 'shanghai',
            children: [
              {
                label: '浦东新区',
                value: 'pudong',
                children: [
                  { label: '陆家嘴', value: 'lujiazui' },
                  { label: '张江', value: 'zhangjiang' },
                ],
              },
              {
                label: '黄浦区',
                value: 'huangpu',
                children: [
                  { label: '外滩', value: 'waitan' },
                  { label: '南京路', value: 'nanjinglu' },
                ],
              },
            ],
          },
          {
            label: '广东省',
            value: 'guangdong',
            children: [
              {
                label: '广州市',
                value: 'guangzhou',
                children: [
                  { label: '天河区', value: 'tianhe' },
                  { label: '越秀区', value: 'yuexiu' },
                ],
              },
              {
                label: '深圳市',
                value: 'shenzhen',
                children: [
                  { label: '南山区', value: 'nanshan' },
                  { label: '福田区', value: 'futian' },
                ],
              },
            ],
          },
        ],
        value: null,
      },
    },
    {
      field: 'treeSelect',
      label: '树形选择',
      component: 'TreeSelect',
      placeholder: '请选择节点',
      help: '从树形结构中选择节点',
      props: {
        options: [
          {
            label: '根节点1',
            value: 'root1',
            children: [
              { label: '子节点1-1', value: 'child1-1' },
              { label: '子节点1-2', value: 'child1-2' },
            ],
          },
          {
            label: '根节点2',
            value: 'root2',
            children: [
              { label: '子节点2-1', value: 'child2-1' },
              { label: '子节点2-2', value: 'child2-2' },
            ],
          },
        ],
        selectionMode: 'single',
        filter: true,
        value: null,
      },
    },

    // 按钮类组件
    {
      field: 'selectButton',
      label: '选择按钮',
      component: 'SelectButton',
      rules: 'required',
      help: '点击按钮选择选项',
      props: {
        options: [
          { label: '选项A', value: 'a' },
          { label: '选项B', value: 'b' },
          { label: '选项C', value: 'c' },
        ],
        multiple: false,
        value: null,
      },
      style: {
        contentClass: 'w100%!',
      },
    },
    {
      field: 'toggleButton',
      label: '切换按钮',
      component: 'ToggleButton',
      help: '点击切换状态',
      props: {
        value: false,
      },
    },
    {
      field: 'toggleSwitch',
      label: '开关',
      component: 'ToggleSwitch',
      help: '滑动开关',
      props: {
        value: false,
      },
    },

    // 特殊输入组件
    {
      field: 'autoComplete',
      label: '自动完成',
      component: 'AutoComplete',
      placeholder: '请输入关键词',
      help: '输入时自动提示',
      props: {
        options: [
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Cherry', value: 'cherry' },
          { label: 'Date', value: 'date' },
          { label: 'Elderberry', value: 'elderberry' },
        ],
        delay: 300,
        minLength: 1,
        value: '',
      },
    },
    {
      field: 'datePicker',
      label: '日期选择',
      component: 'DatePicker',
      placeholder: '请选择日期',
      rules: 'required',
      help: '请选择一个有效日期',
      props: {
        showIcon: true,
        dateFormat: 'yy-mm-dd',
        showButtonBar: true,
        value: null,
      },
    },
    {
      field: 'colorPicker',
      label: '颜色选择',
      component: 'ColorPicker',
      help: '选择颜色',
      props: {
        defaultColor: '#FF0000',
        format: 'hex',
        value: '#FF0000',
      },
    },
    {
      field: 'knob',
      label: '旋钮',
      component: 'Knob',
      help: '旋转选择数值',
      props: {
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
        value: 50,
      },
    },
    {
      field: 'slider',
      label: '滑块',
      component: 'Slider',
      help: '拖动滑块选择数值',
      props: {
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
        range: false,
        value: 50,
      },
    },
    {
      field: 'rating',
      label: '评分',
      component: 'Rating',
      help: '点击星星评分',
      props: {
        stars: 5,
        cancel: true,
        readonly: false,
        value: 0,
      },
    },

    // 复选框和单选
    {
      field: 'checkbox',
      label: '复选框',
      component: 'Checkbox',
      help: '勾选同意条款',
      props: {
        binary: true,
        value: false,
        options: [
          { label: '选项1', value: 'option1' },
          { label: '选项2', value: 'option2' },
          { label: '选项3', value: 'option3' },
        ],
      },
    },
    {
      field: 'radioButton',
      label: '单选按钮',
      component: 'RadioButton',
      rules: 'required',
      help: '选择一个选项',
      props: {
        options: [
          { label: '选项1', value: 'option1' },
          { label: '选项2', value: 'option2' },
          { label: '选项3', value: 'option3' },
        ],
      },
    },

    // 富文本编辑器
    {
      field: 'editor',
      label: '富文本编辑器',
      component: 'Editor',
      help: '支持富文本编辑',
      props: {
        editorStyle: { height: '200px' },
        placeholder: '请输入内容...',
        value: '',
      },
    },

    // 图标字段 - 使用 InputText 替代
    {
      field: 'iconField',
      label: '图标字段',
      component: 'InputText',
      placeholder: '请输入内容',
      help: '带图标的输入字段（示例）',
      props: {
        class: 'p-input-icon-left',
      },
    },

    // 浮动标签 - 使用 InputText 替代
    {
      field: 'floatLabel',
      label: '浮动标签',
      component: 'InputText',
      placeholder: '请输入内容',
      help: '标签会浮动到输入框上方（示例）',
    },

    // 输入标签 - 使用 InputText 替代
    {
      field: 'iftaLabel',
      label: '输入标签',
      component: 'InputText',
      placeholder: '请输入内容',
      help: '带标签的输入字段（示例）',
    },
  ],
  layout: {
    labelAlign: 'left',
    labelPosition: 'right',
    showLabel: true,
    labelWidth: 120,
  },
  style: {
    contentClass: 'w-100%!',
  },
}

// ==================== 表单 Ref 管理 ====================
const schemaFormRef = ref<any>(null)

// ==================== 表单数据响应式状态 ====================
const formValues = ref<Record<string, any>>({})

// ==================== 使用 useSchemaForm Hook ====================
const {
  schema,
  getFormValues,
  validateForm,
  resetForm,
  clearForm,
  submitForm,
  addField,
  removeField,
  updateField,
  getField,
  getFieldValue,
  setFieldValue,
  moveField,
  setValues,
  getValues,
  hasField,
  getFieldIndex,
} = useSchemaForm(schemaFormRef, initialSchema)

// ==================== 监听表单值变化 ====================
import { watch } from 'vue'

// 使用 watch 监听表单值变化，避免频繁调用 getter
watch(
  () => schemaFormRef.value?.values,
  newValues => {
    if (newValues) {
      formValues.value = { ...newValues }
    }
  },
  { deep: true, immediate: true }
)

// ==================== 表单操作函数 ====================

const handleSubmit = (values: Record<string, any>) => {
  console.log('表单提交:', values)
}

// ==================== 演示操作函数 ====================

// 表单整体操作
const handleGetFormValues = () => {
  const formValues = getFormValues()
  console.log('当前表单值:', formValues)
  alert(`当前表单值: ${JSON.stringify(formValues, null, 2)}`)
}

const handleValidateForm = async () => {
  try {
    const result = await validateForm()
    if (result.valid) {
      alert('表单验证通过！')
    } else {
      alert(`表单验证失败: ${JSON.stringify(result.errors, null, 2)}`)
    }
  } catch (_error) {
    alert('验证过程中发生错误')
  }
}

const handleResetForm = () => {
  resetForm()
  alert('表单已重置到初始状态')
}

const handleClearForm = () => {
  clearForm()
  alert('表单已清空')
}

const handleSubmitForm = async () => {
  try {
    await submitForm()
    alert('表单提交成功！')
  } catch (_error) {
    alert('表单提交失败')
  }
}

// 表单项操作
const handleAddField = () => {
  const newField: SchemaColumnsItem = {
    field: `newField_${Date.now()}`,
    label: '新字段',
    component: 'InputText',
    placeholder: '这是一个新添加的字段',
    help: '通过 useSchemaForm hook 动态添加的字段',
  }

  try {
    addField(newField, 0) // 添加到第一个位置
    alert('字段添加成功！')
  } catch (error) {
    alert(`字段添加失败: ${error}`)
  }
}

const handleRemoveField = () => {
  const fieldName = 'inputText'
  if (hasField(fieldName)) {
    const success = removeField(fieldName)
    if (success) {
      alert(`字段 "${fieldName}" 删除成功！`)
    } else {
      alert(`字段 "${fieldName}" 删除失败！`)
    }
  } else {
    alert(`字段 "${fieldName}" 不存在！`)
  }
}

const handleUpdateField = () => {
  const fieldName = 'inputNumber'
  if (hasField(fieldName)) {
    const success = updateField(fieldName, {
      label: '更新后的数字输入',
      help: '这个字段已经被更新了',
      props: {
        min: 0,
        max: 200,
        step: 5,
      },
    })
    if (success) {
      alert(`字段 "${fieldName}" 更新成功！`)
    } else {
      alert(`字段 "${fieldName}" 更新失败！`)
    }
  } else {
    alert(`字段 "${fieldName}" 不存在！`)
  }
}

const handleGetField = () => {
  const fieldName = 'select'
  const field = getField(fieldName)
  if (field) {
    alert(`字段 "${fieldName}" 配置: ${JSON.stringify(field, null, 2)}`)
  } else {
    alert(`字段 "${fieldName}" 不存在！`)
  }
}

const handleGetFieldValue = () => {
  const fieldName = 'inputText'
  const value = getFieldValue(fieldName)
  alert(`字段 "${fieldName}" 的值: ${value}`)
}

const handleSetFieldValue = () => {
  const fieldName = 'inputText'
  const newValue = `设置的值 ${Date.now()}`
  setFieldValue(fieldName, newValue)
  alert(`字段 "${fieldName}" 的值已设置为: ${newValue}`)
}

const handleMoveField = () => {
  const fieldName = 'inputNumber'
  const currentIndex = getFieldIndex(fieldName)
  if (currentIndex >= 0) {
    const newIndex = currentIndex === 0 ? 1 : 0
    const success = moveField(fieldName, newIndex)
    if (success) {
      alert(`字段 "${fieldName}" 已从位置 ${currentIndex} 移动到位置 ${newIndex}`)
    } else {
      alert(`字段 "${fieldName}" 移动失败！`)
    }
  } else {
    alert(`字段 "${fieldName}" 不存在！`)
  }
}

// 批量操作
const handleSetValues = () => {
  const newValues = {
    inputText: '批量设置的文本',
    inputNumber: 42,
    select: 'option2',
    checkbox: true,
    toggleSwitch: true,
  }
  setValues(newValues)
  alert('批量设置表单值成功！')
}

const handleGetValues = () => {
  const allValues = getValues()
  alert(`所有表单值: ${JSON.stringify(allValues, null, 2)}`)
}

// 工具方法
const handleHasField = () => {
  const fieldName = 'inputText'
  const exists = hasField(fieldName)
  alert(`字段 "${fieldName}" ${exists ? '存在' : '不存在'}`)
}

const handleGetFieldIndex = () => {
  const fieldName = 'inputNumber'
  const index = getFieldIndex(fieldName)
  if (index >= 0) {
    alert(`字段 "${fieldName}" 的索引是: ${index}`)
  } else {
    alert(`字段 "${fieldName}" 不存在！`)
  }
}
</script>

<template lang="pug">
div
  .fs-appFontSizex SchemaForm 组件类型示例 + useSchemaForm Hook 演示
  .my-gap.color-text200 展示所有支持的组件类型及其配置，以及 useSchemaForm hook 的各种功能

  // 操作按钮区域（吸顶区域）
  .c-card-accent.between-col.items-start.gap-gap.sticky.top-0.z-2
    .fs-appFontSizes.color-accent100 表单整体操作
    .between-start.gap-gap
      Button(@click='handleGetFormValues') 获取表单值
      Button(@click='handleValidateForm') 验证表单
      Button(@click='handleResetForm') 重置表单
      Button(@click='handleClearForm') 清空表单
      Button(@click='handleSubmitForm') 提交表单

    .fs-appFontSizes.color-accent100 表单项操作
    .between-start.gap-gap
      Button(@click='handleAddField') 添加字段
      Button(@click='handleRemoveField') 删除字段
      Button(@click='handleUpdateField') 更新字段
      Button(@click='handleGetField') 获取字段配置
      Button(@click='handleGetFieldValue') 获取字段值
      Button(@click='handleSetFieldValue') 设置字段值
      Button(@click='handleMoveField') 移动字段

    .fs-appFontSizes.color-accent100 批量操作
    .between-start.gap-gap
      Button(@click='handleSetValues') 批量设置值
      Button(@click='handleGetValues') 获取所有值

    .fs-appFontSizes.color-accent100 工具方法
    .between-start.gap-gap
      Button(@click='handleHasField') 检查字段存在
      Button(@click='handleGetFieldIndex') 获取字段索引

  .c-border.p-padding.my-gapl
    // 表单组件
    SchemaForm(:schema='schema', @submit='handleSubmit', ref='schemaFormRef')

  .mt-4
    .fs-appFontSizex 表单数据预览：
    pre.c-card-primary {{ JSON.stringify(formValues, null, 2) }}
</template>
