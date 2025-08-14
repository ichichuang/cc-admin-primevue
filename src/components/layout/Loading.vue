<script setup lang="ts">
import { toKebabCase } from '@#/index'
import { useLayoutStore } from '@/stores'
import { env } from '@/utils'
import { computed, onMounted, reactive, ref } from 'vue'
const layoutStore = useLayoutStore()
const definitely = computed(() => layoutStore.getDefinitely)
const loadingSize = env.loadingSize
const props = defineProps<{
  size?: number
  page?: boolean
}>()

const newSize = computed(() => {
  return props.size ? props.size : definitely.value / Number(loadingSize)
})

const spinnerStyle = reactive({
  width: `${newSize.value}px`,
  height: `${newSize.value}px`,
  [toKebabCase('circleSize', '--')]: `${newSize.value * 0.24}px`,
  [toKebabCase('borderSize', '--')]: `${newSize.value / 25}px`,
})

const loadingRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 获取 loadingRef 的宽度高度提取出最短的边长
  if (loadingRef.value) {
    const width = loadingRef.value.clientWidth
    const height = loadingRef.value.clientHeight
    const min = Math.min(width, height) / Number(loadingSize)
    if (props.page) {
      spinnerStyle.width = `${min}px`
      spinnerStyle.height = `${min}px`
      spinnerStyle[toKebabCase('circleSize', '--')] = `${min * 0.24}px`
      spinnerStyle[toKebabCase('borderSize', '--')] = `${min / 25}px`
    }
  }
})
</script>

<template lang="pug">
.full.center(ref='loadingRef')
  .overflow-hidden.atom-spinner(:style='spinnerStyle')
    .spinner-inner
      .spinner-line
      .spinner-line
      .spinner-line
      .spinner-circle ●
</template>

<style lang="scss" scoped>
.atom-spinner .spinner-inner {
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
}

.atom-spinner .spinner-circle {
  display: block;
  position: absolute;
  color: var(--primary100);
  font-size: var(--circle-size);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.atom-spinner .spinner-line {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border-left: var(--border-size) solid var(--primary200);
  border-top: var(--border-size) solid transparent;
}

.atom-spinner .spinner-line:nth-child(1) {
  animation: atom-spinner-animation-1 1s linear infinite;
  transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(2) {
  animation: atom-spinner-animation-2 1s linear infinite;
  transform: rotateZ(240deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(3) {
  animation: atom-spinner-animation-3 1s linear infinite;
  transform: rotateZ(360deg) rotateX(66deg) rotateZ(0deg);
}

@keyframes atom-spinner-animation-1 {
  100% {
    transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg);
  }
}

@keyframes atom-spinner-animation-2 {
  100% {
    transform: rotateZ(240deg) rotateX(66deg) rotateZ(360deg);
  }
}

@keyframes atom-spinner-animation-3 {
  100% {
    transform: rotateZ(360deg) rotateX(66deg) rotateZ(360deg);
  }
}
</style>
