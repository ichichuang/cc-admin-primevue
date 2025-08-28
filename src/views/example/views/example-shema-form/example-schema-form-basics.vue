<script setup lang="ts">
import { SchemaForm } from '@/components/modules/schema-form'
import type { FieldSchema, Schema } from '@/components/modules/schema-form/utils/types'
import { reactive, ref } from 'vue'

// ==================== 表单数据 ====================
const formData = ref({})
// 强制重建表单用的 key
const formKey = ref(0)

// ==================== 基础表单 Schema ====================
const initialSchema: Schema = {
  fields: [
    // 基础输入字段
    {
      name: 'username',
      label: '用户名',
      component: 'inputText',
      placeholder: '请输入用户名',
      rules: 'required|min:3|max:20',
      help: '用户名长度为3-20个字符',
    },
    {
      name: 'email',
      label: '邮箱',
      component: 'inputText',
      placeholder: '请输入邮箱地址',
      rules: 'required|email',
    },
    {
      name: 'password',
      label: '密码',
      component: 'password',
      placeholder: '请输入密码',
      rules: 'required|min:6',
      help: '密码至少6位字符',
      props: {
        feedback: false,
        toggleMask: true,
      },
    },
    {
      name: 'confirmPassword',
      label: '确认密码',
      component: 'password',
      placeholder: '请再次输入密码',
      rules: (value, ctx) => {
        if (!value) {
          return '请确认密码'
        }
        if (value !== ctx.values.password) {
          return '两次输入的密码不一致'
        }
        return true
      },
      props: {
        feedback: false,
        toggleMask: true,
      },
    },
    {
      name: 'phone',
      label: '手机号',
      component: 'inputText',
      placeholder: '请输入手机号码',
      rules: 'required',
      props: { maxlength: 11 },
    },
    {
      name: 'age',
      label: '年龄',
      component: 'inputNumber',
      placeholder: '请输入年龄',
      rules: 'required|integer|min:1|max:120',
    },
    {
      name: 'birthday',
      label: '生日',
      component: 'datePicker',
      placeholder: '请选择生日',
      rules: 'required',
    },
    {
      name: 'salary',
      label: '薪资',
      component: 'inputNumber',
      placeholder: '请输入薪资',
      transform: {
        input: value => value / 1000,
        output: value => value * 1000,
      },
      help: '输入的数字会自动乘以1000',
    },
    {
      name: 'description',
      label: '个人描述',
      component: 'textarea',
      placeholder: '请输入个人描述',
      rules: 'max:200',
      help: '最多200个字符',
      layout: {
        cols: 12,
      },
    },

    // 选择字段
    {
      name: 'gender',
      label: '性别',
      component: 'radioButton',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' },
      ],
      rules: 'required',
    },
    {
      name: 'role',
      label: '角色',
      component: 'select',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ],
      rules: 'required',
    },
    {
      name: 'hobbies',
      label: '兴趣爱好',
      component: 'multiSelect',
      options: [
        { label: '阅读', value: 'reading' },
        { label: '音乐', value: 'music' },
        { label: '运动', value: 'sports' },
        { label: '旅游', value: 'travel' },
        { label: '美食', value: 'food' },
      ],
    },
    {
      name: 'city',
      label: '城市',
      component: 'select',
      dependsOn: ['province'],
      options: async ctx => {
        const province = ctx.values.province
        if (!province) {
          return []
        }

        // 模拟异步获取城市数据
        const cityMap: Record<string, Array<{ label: string; value: string }>> = {
          beijing: [{ label: '北京市', value: 'beijing' }],
          shanghai: [{ label: '上海市', value: 'shanghai' }],
          guangdong: [
            { label: '广州市', value: 'guangzhou' },
            { label: '深圳市', value: 'shenzhen' },
            { label: '珠海市', value: 'zhuhai' },
          ],
        }

        return cityMap[province] || []
      },
      rules: 'required',
      visible: ctx => {
        return !!ctx.values.province
      },
    },
    {
      name: 'province',
      label: '省份',
      component: 'select',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广东', value: 'guangdong' },
      ],
      rules: 'required',
    },

    // 开关和复选框
    {
      name: 'isActive',
      label: '是否激活',
      component: 'toggleSwitch',
      defaultValue: true,
    },
    {
      name: 'agreeTerms',
      label: '同意条款',
      component: 'checkbox',
      rules: value => {
        if (value) {
          return true
        }
        return '必须同意条款'
      },
    },
    {
      name: 'receiveNewsletter',
      label: '接收新闻',
      component: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'rating',
      label: '评分',
      component: 'rating',
      rules: 'required|min:1|max:5',
      help: '请给出1-5分的评分',
    },

    // 条件显示字段
    {
      name: 'companyName',
      label: '公司名称',
      component: 'inputText',
      placeholder: '请输入公司名称',
      visible: ctx => {
        return ctx.values.role === 'admin'
      },
      rules: ctx => {
        if (ctx.values.role === 'admin') {
          return 'required'
        }
        return true
      },
    },
    {
      name: 'department',
      label: '部门',
      component: 'select',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '市场部', value: 'marketing' },
        { label: '人事部', value: 'hr' },
      ],
      visible: ctx => {
        return ctx.values.role === 'admin'
      },
      rules: ctx => {
        if (ctx.values.role === 'admin') {
          return 'required'
        }
        return true
      },
    },
    {
      name: 'vipLevel',
      label: 'VIP等级',
      component: 'select',
      options: [
        { label: '普通VIP', value: 'normal' },
        { label: '高级VIP', value: 'premium' },
        { label: '至尊VIP', value: 'ultimate' },
      ],
      visible: ctx => ctx.values.isActive === true,
      rules: ctx => (ctx.values.isActive ? 'required' : true),
    },

    // 只读和禁用字段
    {
      name: 'createTime',
      label: '创建时间',
      component: 'inputText',
      defaultValue: new Date().toLocaleString(),
      readonly: true,
    },
    {
      name: 'status',
      label: '状态',
      component: 'select',
      options: [
        { label: '待审核', value: 'pending' },
        { label: '已通过', value: 'approved' },
        { label: '已拒绝', value: 'rejected' },
      ],
      defaultValue: 'pending',
      disabled: ctx => ctx.values.role === 'guest',
    },

    // 自定义布局字段
    {
      name: 'color',
      label: '主题色',
      component: 'colorPicker',
      defaultValue: '#3B82F6',
      layout: {
        labelPosition: 'top',
        labelAlign: 'left',
      },
    },
    {
      name: 'sliderValue',
      label: '滑块值',
      component: 'slider',
      defaultValue: 50,
      props: { min: 0, max: 100, step: 1 },
      layout: {
        labelPosition: 'top',
        labelAlign: 'left',
      },
    },
    {
      name: 'autoComplete',
      label: '自动完成',
      component: 'autoComplete',
      placeholder: '输入关键词搜索',
      options: [
        { label: 'Vue.js', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Angular', value: 'angular' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
      ],
      layout: {
        labelPosition: 'top',
        labelAlign: 'left',
      },
    },
  ],
  layout: {
    labelAlign: 'left',
    labelPosition: 'left',
    labelWidth: '120px',
    showLabel: true,
  },
}

// ==================== 表单状态管理 ====================
const schema = reactive<any>({ ...initialSchema })
const formRef = ref<any>(null)

// 表单操作方法 - 通过 ref 自动设置

const addField = (field: FieldSchema, index?: number) => {
  if (typeof index === 'number') {
    schema.fields.splice(index, 0, field)
  } else {
    schema.fields.push(field)
  }
}

const removeField = (name: string) => {
  const idx = schema.fields.findIndex((f: any) => f.name === name)
  if (idx >= 0) {
    schema.fields.splice(idx, 1)
  }
}

const updateField = (name: string, patch: Partial<FieldSchema>) => {
  const f = schema.fields.find((f: any) => f.name === name)
  if (f) {
    Object.assign(f, patch)
  }
}

const reset = (initial?: Record<string, any>) => {
  formData.value = initial ? { ...initial } : {}
  console.log('表单数据已重置')
  // 通过变更 key 强制重建 SchemaForm，从而重置内部 Form 状态
  formKey.value++
}

const submitProgrammatic = async () => {
  // 由于 SchemaForm 组件没有暴露表单实例，这里提供一个提示
  console.log('程序化提交功能需要 SchemaForm 组件暴露表单实例')
  return null
}

// ==================== 事件处理 ====================
const handleSubmit = (values: any) => {
  console.log('表单提交成功:', values)
}

const handleError = (payload: { errors: Record<string, string> }) => {
  console.error('表单验证错误:', payload.errors)
}

// 移除 handleFormRef 函数，直接使用 ref

// ==================== 动态操作示例 ====================
const addNewField = () => {
  console.log('添加动态字段')
  const newField = {
    name: `dynamic_${Date.now()}`,
    label: '动态字段',
    component: 'inputText' as const,
    placeholder: '这是一个动态添加的字段',
  }
  addField(newField)
  console.log('当前 schema fields:', schema.fields.length)
}

const removeLastField = () => {
  console.log('删除最后字段')
  const lastField = schema.fields[schema.fields.length - 1]
  console.log('最后字段:', lastField)
  if (lastField && lastField.name.startsWith('dynamic_')) {
    removeField(lastField.name)
    console.log('已删除字段:', lastField.name)
  } else {
    console.log('没有找到可删除的动态字段')
  }
}

const updateFieldExample = () => {
  console.log('更新字段')
  updateField('username', {
    label: '用户名(已更新)',
    defaultValue: '用户名已更新',
    placeholder: '用户名已更新',
  })
  console.log('已更新用户名字段')
}

const resetForm = () => {
  console.log('重置表单')
  reset()
  console.log('表单已重置')
}

const programmaticSubmit = async () => {
  console.log('程序化提交')
  try {
    const result = await submitProgrammatic()
    console.log('程序化提交结果:', result)
  } catch (error) {
    console.error('程序化提交失败:', error)
  }
}
</script>

<template lang="pug">
.full
  // 基础表单
  .full.c-border.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 基础表单示例
    p.color-text200 展示所有类型的表单项、验证规则和配置项

    SchemaForm(
      :key='formKey',
      :schema='schema',
      v-model='formData',
      @submit='handleSubmit',
      @error='handleError',
      ref='formRef'
    )

  // 表单操作
  .full.c-card.p-padding.rounded-rounded.between-col.center-start
    .fs-16.font-semibold.center 表单操作
    p.color-text200 动态操作表单字段和提交

    .between.gap-gap
      Button(label='添加动态字段', severity='success', @click='addNewField')
      Button(label='删除最后字段', severity='warning', @click='removeLastField')
      Button(label='更新字段', severity='info', @click='updateFieldExample')
      Button(label='重置表单', severity='secondary', @click='resetForm')
      Button(label='程序化提交', severity='primary', @click='programmaticSubmit')

  // 表单数据展示
  .full.c-card.p-padding.rounded-rounded.between-col.center-start(class='xl:col-span-2')
    .fs-16.font-semibold.center 表单数据
    p.color-text200 实时显示表单数据变化

    .full.bg-gray-100.p-padding.rounded-rounded
      pre.text-sm {{ JSON.stringify(formData, null, 2) }}

  // Schema 配置展示
  .full.c-card.p-padding.rounded-rounded.between-col.center-start(class='xl:col-span-2')
    .fs-16.font-semibold.center Schema 配置
    p.color-text200 当前表单的 Schema 配置

    .full.bg-gray-100.p-padding.rounded-rounded
      pre.text-sm {{ JSON.stringify(schema, null, 2) }}
</template>
