import type { AnimateName, AnimateRepeat, AnimateSpeed } from '@/types/modules/animate'

/**
 * AnimateWrapper 全局默认配置
 */
export const defaultAnimateConfig = {
  /** 默认进入动画 */
  enter: 'fadeInUp' as AnimateName,
  /** 默认离开动画 */
  leave: 'fadeOutDown' as AnimateName,
  /** 默认动画时长 */
  duration: '800ms',
  /** 默认延迟 */
  delay: '0s',
  /** 默认动画速度 */
  speed: 'fast' as AnimateSpeed,
  /** 默认循环次数 */
  repeat: 1 as AnimateRepeat,
  /** 默认是否初次渲染时执行动画 */
  appear: true,
  /** 默认是否列表模式 */
  group: false,
  /** 默认队列延迟（ms），group 模式队列延迟 */
  stagger: 120,
} as const

/**
 * 动画预设配置
 */
export const animatePresets = {
  /** 淡入淡出 */
  fade: {
    enter: 'fadeIn' as AnimateName,
    leave: 'fadeOut' as AnimateName,
    duration: '600ms',
  },
  /** 缩放 */
  zoom: {
    enter: 'zoomIn' as AnimateName,
    leave: 'zoomOut' as AnimateName,
    duration: '500ms',
  },
  /** 滑动 */
  slide: {
    enter: 'slideInUp' as AnimateName,
    leave: 'slideOutDown' as AnimateName,
    duration: '600ms',
  },
  /** 弹跳 */
  bounce: {
    enter: 'bounceIn' as AnimateName,
    leave: 'bounceOut' as AnimateName,
    duration: '800ms',
  },
  /** 翻转 */
  flip: {
    enter: 'flipInX' as AnimateName,
    leave: 'flipOutX' as AnimateName,
    duration: '700ms',
  },
} as const
