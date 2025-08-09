<script setup lang="ts">
import { defaultAnimateConfig } from '@/constants/modules/animate'
import type { AnimateName, AnimateProps } from '@/types/modules/animate'
import { computed } from 'vue'

interface Props extends Partial<AnimateProps> {
  /** 是否显示 */
  show: boolean
}

const props = defineProps<Props>()

/** 合并默认值 */
const merged = computed(() => ({
  ...defaultAnimateConfig,
  ...props,
}))

/** 构造动画类 */
const buildClass = (name?: AnimateName) => {
  if (!name) {
    return ''
  }
  return [
    'animate__animated',
    `animate__${name}`,
    merged.value.speed ? `animate__${merged.value.speed}` : '',
    merged.value.repeat && merged.value.repeat !== 1
      ? `animate__repeat-${merged.value.repeat}`
      : '',
    merged.value.repeat === 'infinite' ? 'animate__infinite' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

const enterClass = computed(() => buildClass(merged.value.enter))
const leaveClass = computed(() => buildClass(merged.value.leave))

/** CSS 变量 */
const styleVars = computed(() => ({
  '--animate-duration': merged.value.duration,
  '--animate-delay': merged.value.delay,
}))

/** 队列延迟 */
const handleBeforeEnter = (el: Element) => {
  if (merged.value.group && merged.value.stagger) {
    const parent = el.parentNode
    if (parent) {
      const children = Array.from(parent.children)
      const index = children.indexOf(el)
      const delay = index * merged.value.stagger
      ;(el as HTMLElement).style.setProperty('--animate-delay', `${delay}ms`)
    }
  }
}
</script>

<template lang="">
  <!-- 单元素 -->
  <Transition
    v-if="!merged.group"
    :enter-active-class="enterClass"
    :leave-active-class="leaveClass"
    :style="styleVars"
    :appear="merged.appear"
    @before-enter="handleBeforeEnter"
  >
    <div
      v-if="merged.show"
      class="animate-wrapper full center"
    >
      <slot />
    </div>
  </Transition>

  <!-- 列表动画 -->
  <TransitionGroup
    v-else
    tag="div"
    :enter-active-class="enterClass"
    :leave-active-class="leaveClass"
    :style="styleVars"
    :appear="merged.appear"
    @before-enter="handleBeforeEnter"
  >
    <slot />
  </TransitionGroup>
</template>

<style>
.animate__animated {
  animation-duration: var(--animate-duration, 1s);
  animation-delay: var(--animate-delay, 0s);
}

.animate-wrapper {
  display: inline-block; /* 避免 display: contents 导致动画类失效 */
}
</style>

<!--
animation：动画类型（fade、slide、zoom、bounce…）

direction：方向（left、right、up、down）

duration：时长（毫秒）

delay：延迟（毫秒）

repeat：次数或 'infinite'

easing：缓动函数

play：是否播放（可配合 v-if 控制进入/离开）

事件：@start、@end
-->
