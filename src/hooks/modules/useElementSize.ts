// src/composables/useElementSize.ts
import { debounce, throttle } from '@/common'
import { onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'

export interface ElementSize {
  width: number
  height: number
}

export interface UseElementSizeOptions {
  mode?: 'throttle' | 'debounce' | 'none'
  delay?: number
}

/**
 * 监听容器尺寸变化，返回 reactive 的 width/height，同时可选 callback
 * - 使用 @/common 的 throttle / debounce 包装回调
 */
export function useElementSize(
  targetRef: Ref<HTMLElement | null>,
  callback?: (entry: DOMRectReadOnly) => void,
  options: UseElementSizeOptions = {}
) {
  const width = ref(0)
  const height = ref(0)

  const { mode = 'none', delay = 200 } = options

  let observer: ResizeObserver | null = null
  // 包装后的处理函数，兼容 lodash 风格的 cancel/flush
  let handler:
    | (((entry: DOMRectReadOnly) => void) & { cancel?: () => void; flush?: () => void })
    | null = null

  const run = (entry: DOMRectReadOnly) => {
    // 同步响应式尺寸
    width.value = entry.width
    height.value = entry.height
    // 透传给外部
    callback?.(entry)
  }

  // 按 mode 生成包装器
  const createHandler = () => {
    if (mode === 'debounce') {
      return debounce(run, delay) as typeof handler
    }
    if (mode === 'throttle') {
      return throttle(run, delay) as typeof handler
    }
    // none: 直接返回原函数，但保持一致的签名
    const direct = ((e: DOMRectReadOnly) => run(e)) as typeof handler
    return direct
  }

  const cancelHandler = () => {
    handler?.cancel?.()
    handler = null
  }

  const setupObserver = (el: HTMLElement) => {
    // 初始化尺寸，避免等待首帧回调
    const rect = el.getBoundingClientRect()
    width.value = rect.width
    height.value = rect.height

    handler = createHandler()

    observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        // 只处理当前元素
        if (entry.target === el) {
          handler!(entry.contentRect)
        }
      }
    })
    observer.observe(el)
  }

  const teardownObserver = () => {
    observer?.disconnect()
    observer = null
    cancelHandler()
  }

  onMounted(() => {
    watch(
      targetRef,
      el => {
        // 切换目标时释放旧资源
        teardownObserver()
        if (el) {
          setupObserver(el)
        }
      },
      { immediate: true }
    )
  })

  onBeforeUnmount(() => {
    teardownObserver()
  })

  return { width, height }
}
