<script setup lang="ts">
import { useColorStore } from '@/stores'
import { computed } from 'vue'

const colorStore = useColorStore()

const modeOptions = computed(() => colorStore.getModeOptions)
const mode = computed(() => colorStore.getMode)
const isDark = computed(() => colorStore.isDark)

const setMode = (value: Mode) => {
  colorStore.setMode(value)
}

// 获取下一个模式,排除 auto 自动模式（循环切换）
const getNextMode = () => {
  const newModeOptions = modeOptions.value.filter(item => item.value !== 'auto')
  const currentIndex = newModeOptions.findIndex(item => item.value === mode.value)
  const nextIndex = (currentIndex + 1) % newModeOptions.length
  return newModeOptions[nextIndex].value
}

// 切换模式
const toggleMode = () => {
  const nextMode = getNextMode()
  setMode(nextMode)
}
</script>

<template lang="pug">
// 主题切换开关
.c-card-accent.bg-bg100.c-border.rounded-full.gap-4px.p-2(
  class='hover:scale-104%!',
  @click='toggleMode',
  role='button',
  tabindex='0'
)
  // 左侧图标容器（月亮/太阳）
  .center.rounded-full.p-paddings.c-transitions(
    :class='[isDark ? "translate-x-[calc(100%+4px)]" : "translate-x-0 color-accent100! bg-bg200!"]'
  )
    div(:class='["icon-line-md:sunny-outline-twotone"]')

  // 右侧图标容器（太阳/月亮）
  .center.rounded-full.p-paddings.c-transitions(
    :class='[isDark ? "translate-x-[calc(-100%-4px)] color-accent100! bg-bg200!" : "translate-x-0"]'
  )
    div(:class='["icon-line-md:moon-twotone-alt-loop"]')

// 模式提示
//- .mode-tooltip(:class='tooltipClasses')
  | 自动模式
</template>
