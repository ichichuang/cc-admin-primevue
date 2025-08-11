<script setup lang="ts">
import type { AnimateName, AnimateRepeat, AnimateSpeed } from '@/types/modules/animate'
import { ref } from 'vue'

// 单元素动画示例
const visible = ref(false)
const toggleVisible = () => {
  visible.value = !visible.value
}

// 列表动画示例
const items = ref([1, 2, 3, 4, 5])
const addItem = () => {
  items.value.push(items.value.length + 1)
}
const removeItem = (index: number) => {
  items.value.splice(index, 1)
}

// 不同动画类型示例
const currentAnimation = ref<'fade' | 'zoom' | 'slide' | 'bounce' | 'flip'>('fade')
const animationVisible = ref(false)

const animations = [
  {
    key: 'fade' as const,
    label: '淡入淡出',
    enter: 'fadeIn' as AnimateName,
    leave: 'fadeOut' as AnimateName,
  },
  {
    key: 'zoom' as const,
    label: '缩放',
    enter: 'zoomIn' as AnimateName,
    leave: 'zoomOut' as AnimateName,
  },
  {
    key: 'slide' as const,
    label: '滑动',
    enter: 'slideInUp' as AnimateName,
    leave: 'slideOutDown' as AnimateName,
  },
  {
    key: 'bounce' as const,
    label: '弹跳',
    enter: 'bounceIn' as AnimateName,
    leave: 'bounceOut' as AnimateName,
  },
  {
    key: 'flip' as const,
    label: '翻转',
    enter: 'flipInX' as AnimateName,
    leave: 'flipOutX' as AnimateName,
  },
]

// 动画速度选项
const speedOptions = [
  { value: '' as AnimateSpeed, label: '默认' },
  { value: 'slower' as AnimateSpeed, label: '较慢' },
  { value: 'slow' as AnimateSpeed, label: '慢' },
  { value: 'fast' as AnimateSpeed, label: '快' },
  { value: 'faster' as AnimateSpeed, label: '较快' },
]

// 循环次数选项
const repeatOptions = [
  { value: 1 as AnimateRepeat, label: '1次' },
  { value: 2 as AnimateRepeat, label: '2次' },
  { value: 3 as AnimateRepeat, label: '3次' },
  { value: 'infinite' as AnimateRepeat, label: '无限' },
]

// 当前选择的参数
const currentSpeed = ref<AnimateSpeed>('fast')
const currentRepeat = ref<AnimateRepeat>(1)
const currentDuration = ref('800ms')
const currentDelay = ref('0s')
</script>

<template lang="pug">
.p-6.space-y-8
  h1.text-2xl.font-bold.mb-6 AnimateWrapper 动画组件示例
  // 单元素动画示例
  .card.p-4
    h2.text-xl.font-semibold.mb-4 单元素动画
    .flex.gap-4.items-center
      Button(@click='toggleVisible', :label='visible ? "隐藏" : "显示"')
      AnimateWrapper(
        :show='visible',
        enter='zoomIn',
        leave='zoomOut',
        speed='fast',
        duration='800ms',
        delay='0.2s',
        :repeat='2',
        :appear='true'
      )
        .p-4.bg-primary.text-white.rounded-lg.shadow-lg 🎉 Animate.css 完美版组件

  // 列表队列动画示例
  .card.p-4
    h2.text-xl.font-semibold.mb-4 列表队列动画
    .flex.gap-4.mb-4
      Button(@click='addItem', label='添加项目')
      Button(@click='items = [1, 2, 3, 4, 5]', label='重置', severity='secondary')
    AnimateWrapper(
      :show='true',
      appear,
      group,
      enter='fadeInUp',
      leave='fadeOutDown',
      speed='faster',
      duration='500ms',
      :stagger='150'
    )
      .p-3.bg-secondary.text-white.rounded-lg.shadow-md.mb-2.cursor-pointer.transition-colors(
        v-for='(item, index) in items',
        :key='item',
        @click='removeItem(index)',
        class='hover:bg-secondary-dark'
      ) 列表项 {{ item }} (点击删除)

  // 动画类型切换示例
  .card.p-4
    h2.text-xl.font-semibold.mb-4 动画类型切换
    .flex.gap-2.mb-4.flex-wrap
      Button(
        v-for='anim in animations',
        :key='anim.key',
        :label='anim.label',
        :severity='currentAnimation === anim.key ? "help" : "secondary"',
        @click='currentAnimation = anim.key'
      )
    .flex.gap-4.items-center
      Button(
        @click='animationVisible = !animationVisible',
        :label='animationVisible ? "隐藏" : "显示"'
      )
      AnimateWrapper(
        :show='animationVisible',
        :enter='animations.find(a => a.key === currentAnimation)?.enter',
        :leave='animations.find(a => a.key === currentAnimation)?.leave',
        duration='600ms',
        appear
      )
        .p-4.bg-success.text-white.rounded-lg.shadow-lg 🎬 当前动画: {{ animations.find(a => a.key === currentAnimation)?.label }}

  // 动画参数控制示例
  .card.p-4
    h2.text-xl.font-semibold.mb-4 动画参数控制
    .grid.grid-cols-1.gap-4.mb-4(class='md:grid-cols-2 lg:grid-cols-4')
      div
        label.block.text-sm.font-medium.mb-2 动画速度
        Dropdown.w-full(
          v-model='currentSpeed',
          :options='speedOptions',
          option-label='label',
          option-value='value',
          placeholder='选择速度'
        )
      div
        label.block.text-sm.font-medium.mb-2 循环次数
        Dropdown.w-full(
          v-model='currentRepeat',
          :options='repeatOptions',
          option-label='label',
          option-value='value',
          placeholder='选择循环次数'
        )
      div
        label.block.text-sm.font-medium.mb-2 动画时长
        InputText.w-full(v-model='currentDuration', placeholder='例如: 800ms')
      div
        label.block.text-sm.font-medium.mb-2 动画延迟
        InputText.w-full(v-model='currentDelay', placeholder='例如: 0.2s')
    .flex.gap-4.items-center
      Button(
        @click='animationVisible = !animationVisible',
        :label='animationVisible ? "隐藏" : "显示"'
      )
      AnimateWrapper(
        :show='animationVisible',
        enter='bounceIn',
        leave='bounceOut',
        :speed='currentSpeed',
        :repeat='currentRepeat',
        :duration='currentDuration',
        :delay='currentDelay',
        :appear='true'
      )
        .p-4.bg-warning.text-white.rounded-lg.shadow-lg ⚙️ 参数控制动画

  // 无限循环动画示例
  .card.p-4
    h2.text-xl.font-semibold.mb-4 无限循环动画
    AnimateWrapper(:show='true', enter='pulse', duration='1s', repeat='infinite')
      .p-4.bg-warning.text-white.rounded-lg.shadow-lg 🔄 无限循环动画

  // 默认配置示例
  .card.p-4
    h2.text-xl.font-semibold.mb-4 默认配置（零配置调用）
    AnimateWrapper(:show='true')
      .p-4.bg-info.text-white.rounded-lg.shadow-lg ✨ 使用全局默认配置的动画

  // 多种动画效果展示
  .card.p-4
    h2.text-xl.font-semibold.mb-4 多种动画效果展示
    .grid.grid-cols-1.gap-4(class='md:grid-cols-2 lg:grid-cols-3')
      // 淡入淡出
      AnimateWrapper(:show='true', enter='fadeIn', duration='1s')
        .p-4.bg-primary.text-white.rounded-lg.shadow-lg.text-center 🌟 淡入淡出
      // 缩放
      AnimateWrapper(:show='true', enter='zoomIn', duration='1s')
        .p-4.bg-secondary.text-white.rounded-lg.shadow-lg.text-center 🔍 缩放动画
      // 滑动
      AnimateWrapper(:show='true', enter='slideInUp', duration='1s')
        .p-4.bg-success.text-white.rounded-lg.shadow-lg.text-center 📈 滑动动画
      // 弹跳
      AnimateWrapper(:show='true', enter='bounceIn', duration='1s')
        .p-4.bg-warning.text-white.rounded-lg.shadow-lg.text-center 🏀 弹跳动画
      // 翻转
      AnimateWrapper(:show='true', enter='flipInX', duration='1s')
        .p-4.bg-danger.text-white.rounded-lg.shadow-lg.text-center 🔄 翻转动画
      // 旋转
      AnimateWrapper(:show='true', enter='rotateIn', duration='1s')
        .p-4.bg-info.text-white.rounded-lg.shadow-lg.text-center 🎯 旋转动画

  // 动画组合示例
  .card.p-4
    h2.text-xl.font-semibold.mb-4 动画组合示例
    .space-y-4
      AnimateWrapper(:show='true', enter='fadeInDown', duration='800ms', delay='0.1s')
        .p-3.bg-primary.text-white.rounded-lg.shadow-lg 🎨 组合动画 1: 从上方淡入
      AnimateWrapper(:show='true', enter='fadeInDown', duration='800ms', delay='0.2s')
        .p-3.bg-secondary.text-white.rounded-lg.shadow-lg 🎨 组合动画 2: 从上方淡入（延迟0.2s）
      AnimateWrapper(:show='true', enter='fadeInDown', duration='800ms', delay='0.3s')
        .p-3.bg-success.text-white.rounded-lg.shadow-lg 🎨 组合动画 3: 从上方淡入（延迟0.3s）
</template>
