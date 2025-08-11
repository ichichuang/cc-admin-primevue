<script setup lang="ts">
const env = import.meta.env
const title = env.VITE_APP_TITLE
</script>
<template lang="pug">
div
  h1 403
  p Forbidden
  p {{ title }}
</template>
<style lang="scss" scope></style>
