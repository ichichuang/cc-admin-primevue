<script setup lang="ts">
import type { Schema } from '@/components/modules/schema-form/utils/types'
import { useSchemaForm } from '@/hooks/components/useSchemaForm'
import { ref } from 'vue'

// ==================== 分步 Schema 定义 ====================
const initialSchema: Schema = {
  columns: [
    // Step 1: 基本信息
    {
      field: 'username',
      label: '用户名',
      component: 'InputText',
      placeholder: '请输入用户名',
      rules: 'required|min:3|max:20',
      help: '长度 3-20，推荐字母数字组合',
      layout: {
        cols: 4,
        labelAlign: 'top',
      },
    },
    {
      field: 'email',
      label: '邮箱',
      component: 'InputText',
      placeholder: '请输入邮箱',
      rules: 'required|email',
      layout: {
        cols: 4,
        labelAlign: 'top',
      },
    },

    // Step 2: 详情信息
    {
      field: 'age',
      label: '年龄',
      component: 'InputNumber',
      placeholder: '请输入年龄',
      rules: 'required|min:1|max:120|integer',
      props: {
        min: 1,
        max: 120,
        step: 1,
      },
      layout: {
        cols: 3,
        labelAlign: 'top',
      },
    },
    {
      field: 'gender',
      label: '性别',
      component: 'Select',
      rules: 'required',
      props: {
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
          { label: '其他', value: 'other' },
        ],
      },
      layout: {
        cols: 3,
        labelAlign: 'top',
      },
    },

    // Step 3: 偏好设置
    {
      field: 'interests',
      label: '兴趣爱好',
      component: 'MultiSelect',
      help: '可多选',
      props: {
        options: [
          { label: '编程', value: 'code' },
          { label: '阅读', value: 'read' },
          { label: '运动', value: 'sport' },
          { label: '音乐', value: 'music' },
        ],
        filter: true,
      },
      layout: {
        cols: 6,
        labelAlign: 'top',
      },
    },
    {
      field: 'notification',
      label: '消息通知',
      component: 'ToggleSwitch',
      help: '是否开启系统通知',
      props: {
        value: true,
      },
      layout: {
        cols: 2,
        labelAlign: 'top',
      },
      style: {
        contentClass: 'center',
      },
    },

    // Step 4: 时间安排
    {
      field: 'startDate',
      label: '开始日期',
      component: 'DatePicker',
      rules: 'required',
      help: '选择项目开始日期',
      props: {
        mode: 'date',
        valueFormat: 'iso',
        clearable: true,
        minDate: new Date(), // 不能选择过去日期
      },
      layout: {
        cols: 4,
        labelAlign: 'top',
      },
    },
    {
      field: 'endDate',
      label: '结束日期',
      component: 'DatePicker',
      rules: 'required',
      help: '选择项目结束日期',
      props: {
        mode: 'date',
        valueFormat: 'iso',
        clearable: true,
        minDate: new Date(), // 不能选择过去日期
      },
      layout: {
        cols: 4,
        labelAlign: 'top',
      },
    },
    {
      field: 'meetingTime',
      label: '会议时间',
      component: 'DatePicker',
      help: '选择会议的具体时间',
      props: {
        mode: 'datetime',
        valueFormat: 'iso',
        enableSeconds: false,
        clearable: true,
        is24: true,
        minDate: new Date(), // 不能选择过去时间
      },
      layout: {
        cols: 4,
        labelAlign: 'top',
      },
    },
  ],
  steps: [
    { title: '基本信息', fields: ['username', 'email'] },
    { title: '详情信息', fields: ['age', 'gender'] },
    { title: '偏好设置', fields: ['interests', 'notification'] },
    { title: '时间安排', fields: ['startDate', 'endDate', 'meetingTime'] },
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
  gapX: 12,
  gapY: 24,
}

// ==================== 表单 Ref & Hook ====================
const schemaFormRef = ref<any>(null)
const { formValues, schema, submitForm, getFormValues } = useSchemaForm({
  formRef: schemaFormRef,
  initialSchema,
})

// ==================== 处理函数 ====================
const handleSubmit = (values: Record<string, any>) => {
  console.log('分步表单提交:', values)
  window.$toast?.success?.('提交成功！')
}

const handleSubmitForm = async () => {
  const { valid } = await submitForm()
  if (valid) {
    window.$toast?.success?.('表单校验通过并已提交！')
  } else {
    window.$toast?.error?.('当前步骤校验未通过，请检查必填项或格式')
  }
}

const handlePreviewValues = () => {
  const values = getFormValues()
  console.log('当前表单值:', values)
}
</script>

<template lang="pug">
div
  // 操作按钮区域（吸顶区域）
  .c-card.rounded-0.px-padding.between-col.items-start.sticky.top-0.z-2.gap-gaps.items-start.gap-gap
    .fs-appFontSizex SchemaForm 分步表单示例
    .color-text200 使用 steps 配置分步骤填写，内置下一步/上一步与提交
    .between-start.gap-gap
      Button(@click='handleSubmitForm') 校验并提交
      Button(@click='handlePreviewValues') 打印当前值

  .c-border.p-padding.my-gapl
    // 分步表单组件
    SchemaForm(:schema='schema', @submit='handleSubmit', ref='schemaFormRef')

  .full.c-card-accent.fs-appFontSizes.between-col.gap-gap
    span.fs-appFontSizex 表单数据实时预览：
    pre.c-border-primary.p-paddings.full {{ JSON.stringify(formValues, null, 2) }}
</template>

<style lang="scss" scope></style>
