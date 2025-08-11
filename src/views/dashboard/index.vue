<script setup lang="ts">
import { goToRoute } from '@/common'
</script>
<template lang="pug">
.full
  Button(severity='primary', @click='goToRoute("PermissionPage")') 跳转
</template>
<style lang="scss" scope></style>
