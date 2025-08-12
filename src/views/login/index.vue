<script setup lang="ts">
import { login } from '@/api'
import { useUserStoreWithOut } from '@/stores'
import { ref } from 'vue'

const userStore = useUserStoreWithOut()
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true

  try {
    const {
      data: { token },
    } = await login({ username: 'admin', password: '123456' })
    userStore.setToken(token)
  } catch (error) {
    console.error('❌ 登录失败:', error)
    userStore.resetToken()
    userStore.resetUserInfo()
  } finally {
    loading.value = false
  }
}
</script>

<template lang="pug">
.full.center.bg-bg200
  .center-col.gap-gap(class='w40% md:w36% lg:w28% xls:w26%')
    .fs-appFontSizex.font-bold 登录
    .fs-appFontSize 还没有账号？点我注册
    .c-shadow.p-padding.rounded-xl.wfull.c-border.p-paddingl.bg-bg100
      .wfull.h-60.grid.grid-cols-3.gap-gap
        .c-card-accent.center.bg-bg100 QQ
        .c-card-accent.center.bg-bg100 微信
        .c-card-accent.center.bg-bg100 支付宝
      .full.center
        Divider.w-full.p0.my2(align='center', type='dotted')
          span.font-bold 账号密码登录

      Button.full(:disabled='loading', severity='help', @click='handleLogin') {{ loading ? '登录中...' : '登录' }}
    .full.between-end
      .text-warn.c-cp(class='duration-200!') 忘记密码？
      .text-danger.c-cp(class='duration-200!') 立即找回？
</template>
