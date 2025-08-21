<script setup lang="ts">
import { env } from '@/utils'
const version = env.appVersion
</script>
<template lang="pug">
.full.between-end.px-padding.fs-appFontSizes 版本号：{{ version }}
</template>
