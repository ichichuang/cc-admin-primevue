<script setup lang="ts">
import { getMenuTree } from '@/common'

const menuTree = getMenuTree()
console.log('=== 菜单树结构 ===')
console.log('menuTree', menuTree)
</script>
<template lang="pug">
.full.hidden(class='md:block') DesktopSidebar
.full(class='md:hidden') MobileSidebar
</template>
<style lang="scss" scope></style>
