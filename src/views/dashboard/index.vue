<script setup lang="ts">
/* 引入所有环境变量 */
import { env } from '@/utils/modules/env'
const {
  appTitle,
  appVersion,
  appEnv,
  publicPath,
  routerMode,
  port,
  piniaKeyPrefix,
  rootRedirect,
  loadingSize,
  apiBaseUrl,
  debug,
  dropDebugger,
  dropConsole,
  buildAnalyze,
  buildSourcemap,
  compression,
  legacy,
  cdn,
} = env

console.log('env:', env)
</script>
<template lang="pug">
.full
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_APP_TITLE
      p.w-200 {{ appTitle }}
      p.color-dangerColor （ 标题 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_APP_VERSION
      p.w-200 {{ appVersion }}
      p.color-dangerColor （ 版本号 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_APP_ENV
      p.w-200 {{ appEnv }}
      p.color-dangerColor （ 环境 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_PUBLIC_PATH
      p.w-200 {{ publicPath }}
      p.color-dangerColor （ 公共路径 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_ROUTER_MODE
      p.w-200 {{ routerMode }}
      p.color-dangerColor （ 路由模式 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_PORT
      p.w-200 {{ port }}
      p.color-dangerColor （ 端口 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_PINIA_PERSIST_KEY_PREFIX
      p.w-200 {{ piniaKeyPrefix }}
      p.color-dangerColor （ 持久化存储前缀 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_ROOT_REDIRECT
      p.w-200 {{ rootRedirect }}
      p.color-dangerColor （ 根重定向 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_LOADING_SIZE
      p.w-200 {{ loadingSize }}
      p.color-dangerColor （ 加载大小 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_API_BASE_URL
      p.w-200 {{ apiBaseUrl }}
      p.color-dangerColor （ API 基础URL ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_DEBUG
      p.w-200 {{ debug }}
      p.color-dangerColor （ 调试模式启用状态 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_DROP_DEBUGGER
      p.w-200 {{ dropDebugger }}
      p.color-dangerColor （ 移除 debugger 启用状态 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_DROP_CONSOLE
      p.w-200 {{ dropConsole }}
      p.color-dangerColor （ 移除 console 启用状态 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_BUILD_ANALYZE
      p.w-200 {{ buildAnalyze }}
      p.color-dangerColor （ 构建分析启用状态 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_BUILD_SOURCEMAP
      p.w-200 {{ buildSourcemap }}
      p.color-dangerColor （ 构建 sourcemap 启用状态 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_COMPRESSION
      p.w-200 {{ compression }}
      p.color-dangerColor （ 压缩类型 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_LEGACY
      p.w-200 {{ legacy }}
      p.color-dangerColor （ 旧版浏览器支持启用状态 ）
  .my-gap.between-start
    .c-border-accent.border-x-none.border-t-none.flex
      p.w-300.color-accent100 VITE_CDN
      p.w-200 {{ cdn }}
      p.color-dangerColor （ CDN 启用状态 ）
  p(v-for='i in 1000', :key='i') {{ i }}
</template>
<style lang="scss" scope></style>
