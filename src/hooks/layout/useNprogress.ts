/**
 * NProgress 进度条管理的Composable函数
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { computed, watch } from 'vue'
import type { Router } from 'vue-router'
import { useRoute } from 'vue-router'

export function useNprogress(_router?: Router) {
  const route = useRoute()

  /**
   * NProgress 配置
   */
  const configureNProgress = () => {
    NProgress.configure({
      easing: 'ease-in-out', // 缓动更顺滑
      speed: 700, // 稍微慢一点，更有节奏感
      trickle: true, // 保持涓流推进
      trickleSpeed: 150, // 更平滑的涓流速度
      showSpinner: false, // 不显示右上角小圈
      minimum: 0.05, // 从更低的值开始
    })
  }

  /**
   * 开始进度条
   */
  const startProgress = () => {
    NProgress.start()
  }

  /**
   * 结束进度条
   */
  const doneProgress = () => {
    NProgress.done()
  }

  /**
   * 设置进度条进度
   * @param progress 进度值 (0-1)
   */
  const setProgress = (progress: number) => {
    NProgress.set(progress)
  }

  /**
   * 增加进度条进度
   * @param amount 增加的进度值
   */
  const incProgress = (amount?: number) => {
    NProgress.inc(amount)
  }

  /**
   * 移除进度条
   */
  const removeProgress = () => {
    NProgress.remove()
  }

  /**
   * 获取当前进度值
   */
  const getCurrentProgress = () => {
    return NProgress.status
  }

  /**
   * 检查进度条是否正在运行
   */
  const isProgressRunning = computed(() => {
    return NProgress.isStarted()
  })

  /**
   * 监听路由变化，自动管理进度条
   */
  const setupRouteProgress = () => {
    // 路由开始时启动进度条
    watch(
      () => route.path,
      () => {
        startProgress()
      },
      { immediate: false }
    )

    // 路由完成时结束进度条
    watch(
      () => route.path,
      () => {
        // 延迟结束进度条，确保页面内容加载完成
        setTimeout(() => {
          doneProgress()
        }, 100)
      },
      { immediate: false }
    )
  }

  /**
   * 初始化 NProgress
   */
  const initNProgress = () => {
    configureNProgress()
    setupRouteProgress()
  }

  return {
    // 配置相关
    configureNProgress,
    initNProgress,

    // 进度控制
    startProgress,
    doneProgress,
    setProgress,
    incProgress,
    removeProgress,

    // 状态查询
    getCurrentProgress,
    isProgressRunning,

    // 路由集成
    setupRouteProgress,
  }
}
