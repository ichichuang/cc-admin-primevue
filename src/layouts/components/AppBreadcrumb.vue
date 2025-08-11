<script setup lang="ts">
import { getBreadcrumbByRoute } from '@/common'
import { computed } from 'vue'

const breadcrumbs = computed(() => getBreadcrumbByRoute())
</script>
<template lang="pug">
.full.between-start {{ breadcrumbs }}
</template>
<style lang="scss" scope></style>
