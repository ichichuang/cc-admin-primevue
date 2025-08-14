<script setup lang="ts">
import { t } from '@/locales'
const env = import.meta.env
const title = env.VITE_APP_TITLE
</script>
<template lang="pug">
div
  h1 {{ t('common.error.serverErrorTitle') }}
  p {{ t('common.error.serverError') }}
  p {{ title }}
</template>
<style lang="scss" scope></style>
