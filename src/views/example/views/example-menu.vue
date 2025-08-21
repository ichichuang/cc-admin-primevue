<script setup lang="ts"></script>
<template lang="pug">
div
  .bg-red.mb-24(v-for='item in 100', :key='item') menu-{{ item }}
</template>
<style lang="scss" scope></style>
