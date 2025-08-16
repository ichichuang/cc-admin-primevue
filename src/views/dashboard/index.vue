<script setup lang="ts">
import { goToRoute } from '@/common'
import { t } from '@/locales'
</script>
<template lang="pug">
.full
  Button(severity='primary', @click='goToRoute("User")') {{ t('user.management.title') }}{{ t('common.actions.jump') }}
  Button(severity='primary', @click='goToRoute("PermissionPage")') {{ t('permission.page.title') }}{{ t('common.actions.jump') }}
  Button(severity='primary', @click='goToRoute("PermissionButton")') {{ t('permission.button.title') }}{{ t('common.actions.jump') }}
  Button(severity='primary', @click='goToRoute("Example")') {{ t('router.example.example') }}{{ t('common.actions.jump') }}
  Button(severity='primary', @click='goToRoute("ExampleScreen")') {{ t('router.example.screen') }} {{ t('common.actions.jump') }}
  Button(severity='primary', @click='goToRoute("ExampleFullscreen")') {{ t('router.example.fullscreen') }}{{ t('common.actions.jump') }}
  Button(severity='primary', @click='goToRoute("ExampleTest")') {{ t('router.example.test') }}{{ t('common.actions.jump') }}
</template>
<style lang="scss" scope></style>
