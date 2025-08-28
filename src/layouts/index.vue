<script setup lang="ts">
import { debounce, throttle } from '@/common'
import type { AnimateName } from '@/components/modules/animate-wrapper/utils/types'
import { INTERVAL, STRATEGY } from '@/constants/modules/layout'
import AdminLayout from '@/layouts/components/LayoutAdmin.vue'
import FullScreenLayout from '@/layouts/components/LayoutFullScreen.vue'
import RatioLayout from '@/layouts/components/LayoutRatio.vue'
import ScreenLayout from '@/layouts/components/LayoutScreen.vue'
import { useLayoutStore } from '@/stores'
import { useMitt } from '@/utils'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { emit, off } = useMitt()

const router = useRouter()
const layoutStore = useLayoutStore()
const isLoading = computed(() => layoutStore.getIsLoading)

// 根据路由meta获取布局模式，默认为admin
const currentLayoutMode = ref<LayoutMode>('fullscreen')
const toPath = ref<string>('')
const toLayout = ref<string>('')
const formPath = ref<string>('')
const formLayout = ref<string>('')
router.beforeEach((_to, form) => {
  formPath.value = form.path
  formLayout.value = form.meta?.parent || 'admin'
})

router.afterEach(to => {
  toPath.value = to.path
  toLayout.value = to.meta?.parent || 'admin'
  const routeLayout = to.meta?.parent || 'admin'
  currentLayoutMode.value = routeLayout
  layoutStore.setCurrentLayout(currentLayoutMode.value)
})

// 保证动画可用
const isLoadingRef = ref(true)
watch(
  () => isLoading.value,
  loading => {
    console.log('loading: ', loading, ' ******************************')
    if (loading) {
      nextTick(() => {
        isLoadingRef.value = true
      })
    } else {
      nextTick(() => {
        isLoadingRef.value = false
      })
    }
  },
  {
    immediate: true,
  }
)

// 动画配置
const layoutAnimations = {
  fullscreen: {
    enter: 'fadeIn',
    leave: 'fadeOut',
    duration: '1s',
  },
  screen: {
    enter: 'fadeIn',
    leave: 'fadeOut',
    duration: '1s',
  },
  admin: {
    enter: 'fadeIn',
    leave: 'fadeOut',
    duration: '1s',
  },
  ratio: {
    enter: 'fadeIn',
    leave: 'fadeOut',
    duration: '1s',
  },
}

// 根据布局类型获取进入动画
const getLayoutEnterAnimation = (layoutMode: LayoutMode) => {
  return (layoutAnimations[layoutMode]?.enter || 'fadeIn') as AnimateName
}

// 根据切换方向获取离开动画
const getLayoutLeaveAnimation = (fromLayout: string, toLayout: string) => {
  // 如果是相同布局，使用默认离开动画
  if (fromLayout === toLayout) {
    return (layoutAnimations[fromLayout as LayoutMode]?.leave || 'fadeOut') as AnimateName
  }

  // 根据布局层级决定动画方向
  const layoutLevels = { fullscreen: 0, screen: 1, admin: 2, ratio: 3 }
  const fromLevel = layoutLevels[fromLayout as LayoutMode] || 1
  const toLevel = layoutLevels[toLayout as LayoutMode] || 1

  // 向上层级切换（如admin->fullscreen）使用向上动画
  if (toLevel < fromLevel) {
    return 'fadeOutUp'
  }
  // 向下层级切换（如fullscreen->admin）使用向下动画
  else if (toLevel > fromLevel) {
    return 'fadeOutDown'
  }

  return (layoutAnimations[fromLayout as LayoutMode]?.leave || 'fadeOut') as AnimateName
}

// 获取动画时长
const getAnimationDuration = () => {
  return layoutAnimations[currentLayoutMode.value]?.duration || '1s'
}

const handleWindowResize = () => {
  emit('windowResize')
}

onMounted(() => {
  // 监听窗口大小变化事件
  if (STRATEGY === 'debounce') {
    window.addEventListener('resize', debounce(handleWindowResize, INTERVAL))
  } else {
    window.addEventListener('resize', throttle(handleWindowResize, INTERVAL))
  }
})

onUnmounted(() => {
  off('windowResize')
})
</script>

<template lang="pug">
//- 加载动画层
AnimateWrapper(:show='isLoadingRef', enter='fadeIn', leave='fadeOut', duration='500ms', delay='0s')
  .container.fixed.center.t-0.r-0.l-0.b-0.z-999
    Loading

//- 主布局切换层 - 使用单一AnimateWrapper避免冲突
.fixed.t-0.r-0.l-0.b-0.z-2
  AnimateWrapper(
    :show='!isLoadingRef',
    :enter='getLayoutEnterAnimation(currentLayoutMode)',
    :leave='getLayoutLeaveAnimation(formLayout, toLayout)',
    :duration='getAnimationDuration()',
    delay='0s'
  )
    //- 全屏布局
    template(v-if='currentLayoutMode === "fullscreen"')
      component(:is='FullScreenLayout')

    //- 屏幕布局
    template(v-if='currentLayoutMode === "screen"')
      component(:is='ScreenLayout')

    //- 管理布局
    template(v-if='currentLayoutMode === "admin"')
      component(:is='AdminLayout')

    //- 比例布局
    template(v-if='currentLayoutMode === "ratio"')
      component(:is='RatioLayout')
</template>
