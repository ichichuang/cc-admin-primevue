<script setup lang="ts">
import type { SupportedLocale } from '@/locales/types'
import { useLocaleStore } from '@/stores'
import { computed } from 'vue'

const localeStore = useLocaleStore()

/* 尺寸变量配置相关 rounded */
const localesOptions = computed(() => localeStore.availableLocales)
const locale = computed(() => localeStore.currentLocale)

const setLocale = (value: SupportedLocale) => {
  localeStore.switchLocale(value)
}
</script>
<template lang="pug">
.between-start.gap-gap
  span 语言
  ButtonGroup
    template(v-for='item in localesOptions', :key='item.key')
      Button(
        :label='item.name',
        :severity='locale === item.key ? "help" : "secondary"',
        @click='setLocale(item.key)'
      )
</template>
