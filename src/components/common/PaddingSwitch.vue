<script setup lang="ts">
import { t } from '@/locales'
import { useSizeStore } from '@/stores'
import { computed } from 'vue'

const sizeStore = useSizeStore()

/* 尺寸变量配置相关 padding */
const paddingOptions = computed(() => sizeStore.getPaddingOptions)
const padding = computed(() => sizeStore.getPadding)

const setPadding = (value: PaddingOptions['key']) => {
  sizeStore.setPadding(value)
}
</script>
<template lang="pug">
.between-start.gap-gap
  span {{ t('common.settings.padding') }}
  ButtonGroup
    template(v-for='item in paddingOptions', :key='item.value')
      Button(
        :label='item.label',
        :severity='padding === item.key ? "help" : "secondary"',
        @click='setPadding(item.key)'
      )
</template>
