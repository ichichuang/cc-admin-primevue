<script setup lang="ts">
import { t } from '@/locales'
const env = import.meta.env
const title = env.VITE_APP_TITLE
</script>
<template lang="pug">
div
  h1 {{ t('common.error.forbiddenTitle') }}
  p {{ t('common.error.forbidden') }}
  p {{ title }}
</template>
<style lang="scss" scope></style>
