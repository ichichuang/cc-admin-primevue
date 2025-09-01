<script setup lang="ts">
import { useThemeSwitch } from '@/hooks'
import { useColorStore } from '@/stores'
import { computed } from 'vue'

const { toggleThemeWithAnimation } = useThemeSwitch()
const colorStore = useColorStore()

const mode = computed(() => colorStore.mode)

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  toggleThemeWithAnimation(event, true)
}

/* 动态计算高亮背景位置 */
const contentClass = computed(() => {
  return mode.value === 'auto' ? 'between-end' : mode.value === 'dark' ? 'center' : 'between'
})
</script>

<template lang="pug">
// 主题切换开关
.c-border.rounded-full.c-transitions.gap-3.p-3(@click='handleClick', :class='contentClass')
  .w-appFontSizex.h-appFontSizex.center.rounded-full.c-transitions.relative.z-2.p-3.box-content.c-cp
    .w-appFontSize.h-appFontSize(
      class='icon-line-md:sunny-outline-twotone',
      :class='{ "bg-accent100": mode === "light" }'
    )

  .w-appFontSizex.h-appFontSizex.center.rounded-full.c-transitions.relative.z-2.p-3.box-content.c-cp
    .w-appFontSize.h-appFontSize(
      class='icon-line-md:moon-twotone-alt-loop',
      :class='{ "bg-accent100": mode === "dark" }'
    )

  .w-appFontSizex.h-appFontSizex.center.rounded-full.c-transitions.relative.z-2.p-3.box-content.c-cp
    .w-appFontSize.h-appFontSize(class='icon-line-md:monitor', :class='{ "bg-accent100": mode === "auto" }')

  .w-appFontSizex.h-appFontSizex.center.rounded-full.c-transition.active-blob.absolute.p-3.box-content
</template>
<style scoped lang="scss">
.active-blob {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--accent100) 20%, transparent),
      color-mix(in srgb, var(--accent100) 5%, transparent)
    ),
    color-mix(in srgb, var(--bg100) 80%, transparent);

  /* 玻璃背景效果 - 使用主背景色的半透明版本 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* 多层渐变背景 - 基于主题色创建玻璃效果 */

  /* 玻璃边框 - 使用主色调的半透明 */
  border: 1px solid color-mix(in srgb, var(--accent100) 20%, transparent);
  border-top: 1px solid transparent;
  border-bottom: 1px solid color-mix(in srgb, var(--accent200) 30%, transparent);
  border-left: 1px solid color-mix(in srgb, var(--accent100) 30%, transparent);

  z-index: 1;
}
</style>
